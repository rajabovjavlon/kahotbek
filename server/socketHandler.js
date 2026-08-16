// Authoritative Real-Time Game Room & Live Chat Engine for Kahotbek
// Provides anti-cheat, real player synchronization, team modes, spectator views, and live chat

const rooms = new Map();

function sanitizeText(str, maxLen = 150) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, maxLen);
}

export function setupSocketHandlers(io) {
  io.on('connection', (socket) => {
    // 1. HOST CREATES ROOM
    socket.on('create_room', ({ pin, quiz, hostName, hostAvatar, mode = 'race' }, callback) => {
      const roomPin = String(pin || Math.floor(100000 + Math.random() * 900000)).trim();
      const hostSecret = `secret_${Math.random().toString(36).substring(2)}_${Date.now()}`;

      const newRoom = {
        pin: roomPin,
        hostSocketId: socket.id,
        hostSecret,
        quiz,
        mode, // 'race' (Track Road), 'teams' (Qizil vs Ko'k), 'classic'
        currentQIndex: 0,
        phase: 'lobby', // lobby, intro, question, result, leaderboard, finished
        players: new Map(),
        spectators: new Map(),
        messages: [],
        questionStartTime: 0,
        questionAnswers: new Map(),
        timerInterval: null
      };

      // Add Host as first member
      newRoom.players.set(socket.id, {
        id: socket.id,
        name: sanitizeText(hostName || 'Host', 20),
        avatar: hostAvatar || '👑',
        isHost: true,
        score: 0,
        streak: 0,
        step: 0, // Road Race step
        team: 'red',
        trailEffect: 'trail_fire'
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

    // 2. REAL PLAYER JOINS ROOM
    socket.on('join_room', ({ pin, name, avatar, team = 'red', trailEffect = 'trail_fire' }, callback) => {
      const roomPin = String(pin).trim();
      const room = rooms.get(roomPin);

      if (!room) {
        if (callback) callback({ success: false, message: "Bunday PIN kodli xona topilmadi!" });
        return;
      }

      const cleanName = sanitizeText(name || 'O\'yinchi', 20);
      if (!cleanName) {
        if (callback) callback({ success: false, message: "Iltimos, ismingizni kiriting!" });
        return;
      }

      // If game already started, join as spectator
      if (room.phase !== 'lobby') {
        const newSpectator = {
          id: socket.id,
          name: cleanName,
          avatar: avatar || '🦁',
          isSpectator: true
        };
        room.spectators.set(socket.id, newSpectator);
        socket.join(roomPin);
        socket.currentRoomPin = roomPin;

        if (callback) {
          callback({
            success: true,
            isSpectator: true,
            pin: roomPin,
            quiz: room.quiz,
            players: Array.from(room.players.values()),
            spectatorsCount: room.spectators.size,
            phase: room.phase
          });
        }

        io.to(roomPin).emit('spectator_joined', {
          spectator: newSpectator,
          spectatorsCount: room.spectators.size
        });
        return;
      }

      const newPlayer = {
        id: socket.id,
        name: cleanName,
        avatar: avatar || '🦁',
        isHost: false,
        score: 0,
        streak: 0,
        step: 0,
        team: team || (room.players.size % 2 === 0 ? 'red' : 'blue'),
        trailEffect: trailEffect || 'trail_fire'
      };

      room.players.set(socket.id, newPlayer);
      socket.join(roomPin);
      socket.currentRoomPin = roomPin;

      const playerList = Array.from(room.players.values());

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

      io.to(roomPin).emit('player_joined', {
        player: newPlayer,
        players: playerList
      });

      console.log(`[Player Joined] ${cleanName} (${avatar}) -> Room ${roomPin}`);
    });

    // 3. JOIN AS SPECTATOR (Kuzatuvchi)
    socket.on('join_as_spectator', ({ pin, name, avatar }, callback) => {
      const roomPin = String(pin).trim();
      const room = rooms.get(roomPin);

      if (!room) {
        if (callback) callback({ success: false, message: "Bunday PIN kodli xona topilmadi!" });
        return;
      }

      const cleanName = sanitizeText(name || 'Kuzatuvchi', 20);
      const newSpectator = {
        id: socket.id,
        name: cleanName,
        avatar: avatar || '👀',
        isSpectator: true
      };

      room.spectators.set(socket.id, newSpectator);
      socket.join(roomPin);
      socket.currentRoomPin = roomPin;

      if (callback) {
        callback({
          success: true,
          pin: roomPin,
          quiz: room.quiz,
          players: Array.from(room.players.values()),
          spectatorsCount: room.spectators.size,
          phase: room.phase
        });
      }

      io.to(roomPin).emit('spectator_joined', {
        spectator: newSpectator,
        spectatorsCount: room.spectators.size
      });
    });

    // 4. LIVE CHAT: SEND MESSAGE
    socket.on('send_chat_message', ({ pin, message }) => {
      const roomPin = String(pin).trim();
      if (!roomPin) return;

      const sanitizedMsg = {
        ...message,
        text: sanitizeText(message?.text || '', 150)
      };

      // Broadcast to room
      socket.to(roomPin).emit('chat_message', sanitizedMsg);
    });

    // 5. LIVE CHAT: DELETE MESSAGE
    socket.on('delete_chat_message', ({ pin, messageId }) => {
      const roomPin = String(pin).trim();
      if (!roomPin || !messageId) return;

      io.to(roomPin).emit('chat_message_deleted', { messageId });
    });

    // 6. HOST STARTS GAME
    socket.on('host_start_game', ({ pin, hostSecret }) => {
      const room = rooms.get(pin);
      if (!room || room.hostSecret !== hostSecret) return;

      room.phase = 'intro';
      room.currentQIndex = 0;

      io.to(pin).emit('game_started', {
        totalQuestions: room.quiz.questions.length
      });

      setTimeout(() => {
        sendQuestionToRoom(io, room);
      }, 3500);
    });

    // 7. PLAYER SUBMITS ANSWER & ADVANCES STEP ON TRACK ROAD
    socket.on('submit_answer', ({ pin, optionIndex, trailEffect }) => {
      const room = rooms.get(pin);
      if (!room || room.phase !== 'question') return;

      const player = room.players.get(socket.id);
      if (!player || room.questionAnswers.has(socket.id)) return;

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
        player.step += 1; // Advance 1 step forward on track road
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
        streak: player.streak,
        currentStep: player.step
      });

      // Broadcast step movement with trail effect to spectators & other players
      if (isCorrect) {
        io.to(pin).emit('player_stepped_forward', {
          playerId: player.id,
          playerName: player.name,
          avatar: player.avatar,
          newStep: player.step,
          team: player.team,
          trailEffect: trailEffect || player.trailEffect || 'trail_fire'
        });
      }

      const nonHostCount = Array.from(room.players.values()).filter(p => !p.isHost).length;
      if (room.questionAnswers.size >= nonHostCount && nonHostCount > 0) {
        clearTimeout(room.timerInterval);
        endQuestionAndReveal(io, room);
      }
    });

    // 8. DISCONNECT HANDLING
    socket.on('disconnect', () => {
      if (socket.currentRoomPin) {
        const room = rooms.get(socket.currentRoomPin);
        if (room) {
          room.players.delete(socket.id);
          room.spectators.delete(socket.id);
          io.to(socket.currentRoomPin).emit('player_left', {
            playerId: socket.id,
            players: Array.from(room.players.values())
          });

          if (room.players.size === 0 && room.spectators.size === 0) {
            clearTimeout(room.timerInterval);
            rooms.delete(socket.currentRoomPin);
          }
        }
      }
    });
  });
}

function sendQuestionToRoom(io, room) {
  room.phase = 'question';
  room.questionAnswers.clear();
  room.questionStartTime = Date.now();

  const currentQ = room.quiz.questions[room.currentQIndex];
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

  const timeLimitMs = (currentQ.timeLimit || 20) * 1000;
  room.timerInterval = setTimeout(() => {
    endQuestionAndReveal(io, room);
  }, timeLimitMs + 500);
}

function endQuestionAndReveal(io, room) {
  room.phase = 'result';
  const currentQ = room.quiz.questions[room.currentQIndex];
  const correctIdx = currentQ.options.findIndex(o => o.isCorrect);

  io.to(room.pin).emit('question_ended', {
    correctOptionIndex: correctIdx,
    explanation: currentQ.explanation || '',
    players: Array.from(room.players.values()).sort((a, b) => b.score - a.score)
  });
}
