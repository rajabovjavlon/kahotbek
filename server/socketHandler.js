// Authoritative Real-Time Game Room Engine for Kahotbek
// Provides anti-cheat, real player synchronization, and live WebSocket broadcasts

const rooms = new Map();

// Helper to sanitize text from XSS
function sanitizeText(str, maxLen = 30) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, maxLen);
}

export function setupSocketHandlers(io) {
  io.on('connection', (socket) => {
    // 1. HOST CREATES ROOM
    socket.on('create_room', ({ pin, quiz, hostName, hostAvatar }, callback) => {
      const roomPin = String(pin || Math.floor(100000 + Math.random() * 900000)).trim();
      const hostSecret = `secret_${Math.random().toString(36).substring(2)}_${Date.now()}`;

      const newRoom = {
        pin: roomPin,
        hostSocketId: socket.id,
        hostSecret,
        quiz,
        currentQIndex: 0,
        phase: 'lobby', // lobby, intro, question, result, leaderboard, finished
        players: new Map(),
        questionStartTime: 0,
        questionAnswers: new Map(), // socketId -> { optionIndex, isCorrect, points, timeTaken }
        timerInterval: null
      };

      // Add Host as first member
      newRoom.players.set(socket.id, {
        id: socket.id,
        name: sanitizeText(hostName || 'Host', 20),
        avatar: hostAvatar || '👑',
        isHost: true,
        score: 0,
        streak: 0
      });

      rooms.set(roomPin, newRoom);
      socket.join(roomPin);
      socket.currentRoomPin = roomPin;

      if (callback) {
        callback({
          success: true,
          pin: roomPin,
          hostSecret,
          players: Array.from(newRoom.players.values())
        });
      }

      console.log(`[Room Created] PIN: ${roomPin} by host ${socket.id}`);
    });

    // 2. REAL PLAYER JOINS ROOM (NO BOTS)
    socket.on('join_room', ({ pin, name, avatar }, callback) => {
      const roomPin = String(pin).trim();
      const room = rooms.get(roomPin);

      if (!room) {
        if (callback) callback({ success: false, message: "Bunday PIN kodli xona topilmadi!" });
        return;
      }

      if (room.phase !== 'lobby') {
        if (callback) callback({ success: false, message: "O'yin allaqachon boshlangan!" });
        return;
      }

      const cleanName = sanitizeText(name || 'O\'yinchi', 20);
      if (!cleanName) {
        if (callback) callback({ success: false, message: "Iltimos, ismingizni kiriting!" });
        return;
      }

      const newPlayer = {
        id: socket.id,
        name: cleanName,
        avatar: avatar || '🦁',
        isHost: false,
        score: 0,
        streak: 0
      };

      room.players.set(socket.id, newPlayer);
      socket.join(roomPin);
      socket.currentRoomPin = roomPin;

      const playerList = Array.from(room.players.values());

      // Notify player
      if (callback) {
        callback({
          success: true,
          pin: roomPin,
          quiz: {
            title: room.quiz.title,
            category: room.quiz.category,
            totalQuestions: room.quiz.questions.length,
            icon: room.quiz.icon
          },
          player: newPlayer,
          players: playerList
        });
      }

      // Broadcast to everyone in room that a real player joined
      io.to(roomPin).emit('player_joined', {
        player: newPlayer,
        players: playerList
      });

      console.log(`[Player Joined] ${cleanName} (${avatar}) -> Room ${roomPin}`);
    });

    // 3. HOST STARTS GAME
    socket.on('host_start_game', ({ pin, hostSecret }) => {
      const room = rooms.get(pin);
      if (!room || room.hostSecret !== hostSecret) return;

      room.phase = 'intro';
      room.currentQIndex = 0;

      // Broadcast game start & 3-2-1 countdown
      io.to(pin).emit('game_started', {
        totalQuestions: room.quiz.questions.length
      });

      // After 3.5 seconds, send first question
      setTimeout(() => {
        sendQuestionToRoom(io, room);
      }, 3500);
    });

    // 4. PLAYER SUBMITS ANSWER (Anti-Cheat Server Calculation)
    socket.on('submit_answer', ({ pin, optionIndex }) => {
      const room = rooms.get(pin);
      if (!room || room.phase !== 'question') return;

      const player = room.players.get(socket.id);
      if (!player || room.questionAnswers.has(socket.id)) return; // Already answered

      const currentQ = room.quiz.questions[room.currentQIndex];
      const correctIdx = currentQ.options.findIndex(o => o.isCorrect);

      const timeTakenSec = (Date.now() - room.questionStartTime) / 1000;
      const timeLimit = currentQ.timeLimit || 20;

      const isCorrect = optionIndex === correctIdx;
      let points = 0;

      if (isCorrect && timeTakenSec <= timeLimit + 1) {
        const timeFactor = Math.max(0, (timeLimit - timeTakenSec) / timeLimit);
        const maxPoints = currentQ.points || 1000;
        points = Math.round(maxPoints * (0.5 + 0.5 * timeFactor));
        player.score += points;
        player.streak += 1;
      } else {
        player.streak = 0;
      }

      room.questionAnswers.set(socket.id, {
        optionIndex,
        isCorrect,
        points,
        timeTaken: timeTakenSec
      });

      // Acknowledge to player
      socket.emit('answer_received', {
        success: true,
        optionIndex,
        isCorrect,
        pointsEarned: points,
        streak: player.streak
      });

      // Check if all non-host players answered
      const nonHostCount = Array.from(room.players.values()).filter(p => !p.isHost).length;
      if (room.questionAnswers.size >= nonHostCount && nonHostCount > 0) {
        clearTimeout(room.timerInterval);
        endQuestionAndReveal(io, room);
      }
    });

    // 5. HOST ADVANCES TO NEXT QUESTION OR PODIUM
    socket.on('host_next_step', ({ pin, hostSecret }) => {
      const room = rooms.get(pin);
      if (!room || room.hostSecret !== hostSecret) return;

      if (room.phase === 'result') {
        // Show mid-leaderboard
        room.phase = 'leaderboard';
        io.to(pin).emit('show_leaderboard', {
          players: Array.from(room.players.values()).sort((a, b) => b.score - a.score),
          currentQIndex: room.currentQIndex + 1,
          totalQuestions: room.quiz.questions.length
        });
      } else if (room.phase === 'leaderboard') {
        if (room.currentQIndex + 1 < room.quiz.questions.length) {
          // Next question
          room.currentQIndex += 1;
          room.phase = 'intro';
          io.to(pin).emit('question_intro', {
            questionNumber: room.currentQIndex + 1,
            totalQuestions: room.quiz.questions.length
          });

          setTimeout(() => {
            sendQuestionToRoom(io, room);
          }, 3200);
        } else {
          // Finish game & show podium
          room.phase = 'finished';
          const finalStandings = Array.from(room.players.values())
            .filter(p => !p.isHost || room.players.size === 1)
            .sort((a, b) => b.score - a.score);

          io.to(pin).emit('game_finished', {
            finalScores: finalStandings
          });
        }
      }
    });

    // 6. DISCONNECT HANDLING
    socket.on('disconnect', () => {
      if (socket.currentRoomPin) {
        const room = rooms.get(socket.currentRoomPin);
        if (room) {
          room.players.delete(socket.id);
          io.to(socket.currentRoomPin).emit('player_left', {
            playerId: socket.id,
            players: Array.from(room.players.values())
          });

          // If room empty or host left
          if (room.players.size === 0 || socket.id === room.hostSocketId) {
            clearTimeout(room.timerInterval);
            rooms.delete(socket.currentRoomPin);
          }
        }
      }
    });
  });
}

// Helper: Broadcast Question
function sendQuestionToRoom(io, room) {
  room.phase = 'question';
  room.questionAnswers.clear();
  room.questionStartTime = Date.now();

  const currentQ = room.quiz.questions[room.currentQIndex];

  // Send question details (masking isCorrect from players to prevent inspection)
  const sanitizedOptions = currentQ.options.map(opt => ({
    text: opt.text,
    color: opt.color,
    shape: opt.shape
  }));

  io.to(room.pin).emit('question_start', {
    questionIndex: room.currentQIndex,
    totalQuestions: room.quiz.questions.length,
    question: currentQ.question,
    options: sanitizedOptions,
    timeLimit: currentQ.timeLimit || 20,
    points: currentQ.points || 1000
  });

  // Server-side authoritative timer
  const timeLimitMs = (currentQ.timeLimit || 20) * 1000;
  room.timerInterval = setTimeout(() => {
    endQuestionAndReveal(io, room);
  }, timeLimitMs + 500);
}

// Helper: End Question and Broadcast stats
function endQuestionAndReveal(io, room) {
  room.phase = 'result';
  const currentQ = room.quiz.questions[room.currentQIndex];
  const correctIdx = currentQ.options.findIndex(o => o.isCorrect);

  // Calculate choices histogram
  const stats = [0, 0, 0, 0];
  for (const ans of room.questionAnswers.values()) {
    if (ans.optionIndex >= 0 && ans.optionIndex < 4) {
      stats[ans.optionIndex]++;
    }
  }

  io.to(room.pin).emit('question_ended', {
    correctOptionIndex: correctIdx,
    explanation: currentQ.explanation || '',
    stats: stats,
    players: Array.from(room.players.values()).sort((a, b) => b.score - a.score)
  });
}
