import React, { useState, useEffect, useRef } from 'react';
import { 
  Flame, 
  Check, 
  X, 
  Sparkles,
  MessageSquare,
  Eye,
  Flag,
  Users
} from 'lucide-react';
import { soundManager } from '../utils/sounds';
import { fireQuickStreakConfetti } from '../utils/confetti';
import LiveChat from '../components/LiveChat';
import { socket } from '../utils/socket';
import { SHOP_ITEMS } from '../data/shopItems';

const SHAPES = [
  { shape: '▲', color: '#dc2626', name: 'Qizil' },
  { shape: '◆', color: '#2563eb', name: "Ko'k" },
  { shape: '●', color: '#d97706', name: 'Sariq' },
  { shape: '■', color: '#059669', name: 'Yashil' },
];

const FLOATING_EMOJIS = ['🔥', '👏', '😂', '⚡', '😎', '🚀', '🎯', '🎉'];

export default function GamePlayView({
  quiz,
  players = [],
  user,
  roomPin = '',
  isSpectator = false,
  gameMode = 'race', // 'race' or 'teams' or 'classic'
  onFinishGame
}) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [phase, setPhase] = useState('intro');
  const [introCount, setIntroCount] = useState(3);
  
  const currentQuestion = quiz.questions[currentQIndex] || quiz.questions[0];
  const [timeLeft, setTimeLeft] = useState(currentQuestion?.timeLimit || 15);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [floatingReactions, setFloatingReactions] = useState([]);
  
  // Track Steps (Yo'lda yurish 1 qadam)
  const [myStep, setMyStep] = useState(0);
  const [activeTrails, setActiveTrails] = useState({}); // { [playerId]: trailEffectId }
  const [playerSteps, setPlayerSteps] = useState(() => {
    const map = {};
    players.forEach(p => { map[p.id || p.name] = 0; });
    map[user.id || user.name] = 0;
    return map;
  });

  // Chat sidebar toggle
  const [isChatOpen, setIsChatOpen] = useState(true);

  const autoNextTimerRef = useRef(null);
  const hasAnsweredRef = useRef(false);

  // Get active trail effect info
  const equippedTrailId = user.equippedTrail || 'trail_fire';
  const currentTrailItem = SHOP_ITEMS.find(it => it.id === equippedTrailId) || SHOP_ITEMS[0];

  // Socket listener for other players' steps and floating emoji reactions
  useEffect(() => {
    const handlePlayerStep = (data) => {
      setPlayerSteps((prev) => ({
        ...prev,
        [data.playerId || data.playerName]: data.newStep
      }));

      // Trigger trail animation
      setActiveTrails((prev) => ({
        ...prev,
        [data.playerId || data.playerName]: data.trailEffect
      }));

      setTimeout(() => {
        setActiveTrails((prev) => {
          const next = { ...prev };
          delete next[data.playerId || data.playerName];
          return next;
        });
      }, 2000);
    };

    const handleLiveReaction = (reaction) => {
      soundManager.playReaction();
      setFloatingReactions(prev => [...prev.slice(-15), reaction]);
      setTimeout(() => {
        setFloatingReactions(prev => prev.filter(r => r.id !== reaction.id));
      }, 2500);
    };

    socket.on('player_stepped_forward', handlePlayerStep);
    socket.on('live_reaction', handleLiveReaction);

    return () => {
      socket.off('player_stepped_forward', handlePlayerStep);
      socket.off('live_reaction', handleLiveReaction);
    };
  }, []);

  const handleSendReaction = (emoji) => {
    soundManager.playReaction();
    const newReaction = {
      id: `react_${Date.now()}_${Math.random()}`,
      emoji,
      senderName: user.name,
      avatar: user.avatar
    };

    setFloatingReactions(prev => [...prev.slice(-15), newReaction]);
    setTimeout(() => {
      setFloatingReactions(prev => prev.filter(r => r.id !== newReaction.id));
    }, 2500);

    if (roomPin) {
      socket.emit('send_reaction', {
        pin: roomPin,
        emoji,
        senderName: user.name,
        avatar: user.avatar
      });
    }
  };

  // 1. Intro 3-2-1 countdown
  useEffect(() => {
    if (phase === 'intro') {
      soundManager.playTick(true);
      if (introCount > 1) {
        const timer = setTimeout(() => {
          setIntroCount(c => c - 1);
        }, 700);
        return () => clearTimeout(timer);
      } else if (introCount === 1) {
        const timer = setTimeout(() => {
          setIntroCount(0);
          setPhase('question');
          setTimeLeft(currentQuestion?.timeLimit || 20);
          hasAnsweredRef.current = false;
          setSelectedOptionIndex(null);
        }, 700);
        return () => clearTimeout(timer);
      }
    }
  }, [phase, introCount, currentQuestion]);

  // 2. Question countdown timer
  useEffect(() => {
    if (phase === 'question') {
      if (timeLeft > 0) {
        soundManager.playTick(timeLeft <= 5);
        const timer = setTimeout(() => {
          setTimeLeft(t => t - 1);
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        handleTimeExpired();
      }
    }
  }, [phase, timeLeft]);

  useEffect(() => {
    return () => {
      if (autoNextTimerRef.current) clearTimeout(autoNextTimerRef.current);
    };
  }, []);

  const handleTimeExpired = () => {
    if (!hasAnsweredRef.current) {
      hasAnsweredRef.current = true;
      revealAndAutoAdvance(null);
    }
  };

  const handleSelectOption = (optIdx) => {
    if (phase !== 'question' || hasAnsweredRef.current || isSpectator) return;
    hasAnsweredRef.current = true;
    setSelectedOptionIndex(optIdx);
    soundManager.playSelectAnswer();

    revealAndAutoAdvance(optIdx);
  };

  const revealAndAutoAdvance = (userChoice) => {
    const correctIdx = currentQuestion.options.findIndex(o => o.isCorrect);
    const userIsCorrect = userChoice === correctIdx;
    
    const maxPoints = currentQuestion.points || 1000;
    const timeFactor = Math.max(0, timeLeft / (currentQuestion.timeLimit || 20));
    const earned = userIsCorrect ? Math.round(maxPoints * (0.5 + 0.5 * timeFactor)) : 0;

    setIsAnswerCorrect(userIsCorrect);
    setPointsEarned(earned);

    let newTotalScore = totalScore;
    let newCorrectCount = correctCount;
    let newStreak = streak;
    let newStep = myStep;

    if (userIsCorrect) {
      soundManager.playCorrect();
      newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
      newCorrectCount = correctCount + 1;
      setCorrectCount(newCorrectCount);
      newTotalScore = totalScore + earned;
      setTotalScore(newTotalScore);
      
      // Advance 1 step forward on track road
      newStep = myStep + 1;
      setMyStep(newStep);
      setPlayerSteps((prev) => ({
        ...prev,
        [user.id || user.name]: newStep
      }));

      // Trigger own trail animation
      setActiveTrails((prev) => ({
        ...prev,
        [user.id || user.name]: equippedTrailId
      }));

      setTimeout(() => {
        setActiveTrails((prev) => {
          const next = { ...prev };
          delete next[user.id || user.name];
          return next;
        });
      }, 2000);

      // Emit to server
      if (roomPin) {
        socket.emit('submit_answer', {
          pin: roomPin,
          optionIndex: userChoice,
          trailEffect: equippedTrailId
        });
      }

      if (newStreak >= 2) {
        fireQuickStreakConfetti();
        soundManager.playStreak();
      }
    } else {
      soundManager.playWrong();
      setStreak(0);
    }

    setPhase('revealed');

    autoNextTimerRef.current = setTimeout(() => {
      if (currentQIndex + 1 < quiz.questions.length) {
        setCurrentQIndex(c => c + 1);
        setIntroCount(3);
        setPhase('intro');
      } else {
        soundManager.playFanfare();
        const finalStandings = [
          {
            name: user.name,
            username: user.username || `@${user.name.toLowerCase().replace(/\s+/g, '_')}`,
            avatar: user.avatar || '🦁',
            currentScore: newTotalScore,
            correctCount: newCorrectCount,
            totalQuestions: quiz.questions.length,
            maxStreak: Math.max(newStreak, maxStreak),
            finalStep: newStep
          }
        ];
        onFinishGame(finalStandings);
      }
    }, 1800);
  };

  const isRevealed = phase === 'revealed';
  const totalSteps = quiz.questions.length;

  // Track racers list
  const trackRacers = players.length > 0 ? players : [
    { id: user.id || user.name, name: user.name, avatar: user.avatar || '🦁', isHost: true }
  ];

  return (
    <div style={{
      maxWidth: '1440px',
      margin: '0 auto',
      padding: '16px 20px 60px',
      display: 'grid',
      gridTemplateColumns: isChatOpen ? '1fr 340px' : '1fr',
      gap: '20px',
      minHeight: '85vh',
      alignItems: 'start'
    }}>
      {/* LEFT / CENTER: GAMEPLAY & RACE TRACK */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Top Status Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          {/* Question Counter */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#121826',
            padding: '8px 14px',
            borderRadius: '12px',
            border: '1px solid #1e283d'
          }}>
            <span style={{ fontSize: '16px' }}>⚡</span>
            <span style={{ fontSize: '14px', fontWeight: '800', color: '#ffffff' }}>
              Savol {currentQIndex + 1} / {quiz.questions.length}
            </span>
          </div>

          {/* Circular Countdown Timer */}
          <div style={{
            position: 'relative',
            width: '64px',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="#1e283d"
                strokeWidth="5"
                fill="transparent"
              />
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke={timeLeft <= 5 ? '#ef4444' : '#0284c7'}
                strokeWidth="5"
                fill="transparent"
                strokeDasharray="163.3"
                strokeDashoffset={163.3 * (1 - timeLeft / (currentQuestion.timeLimit || 20))}
                style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease' }}
              />
            </svg>
            <span style={{
              position: 'absolute',
              fontSize: '18px',
              fontWeight: '900',
              fontFamily: 'var(--font-mono)',
              color: timeLeft <= 5 ? '#ef4444' : '#ffffff'
            }}>
              {timeLeft}
            </span>
          </div>

          {/* Live Score, Streak & Chat toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {streak >= 2 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: '#f59e0b',
                fontWeight: '800',
                fontSize: '12px',
                background: '#121826',
                padding: '8px 12px',
                borderRadius: '12px',
                border: '1px solid #1e283d'
              }}>
                <Flame size={15} fill="#f59e0b" />
                <span>{streak}x Combo</span>
              </div>
            )}

            <div style={{
              fontSize: '14px',
              fontWeight: '800',
              color: '#38bdf8',
              background: '#121826',
              padding: '8px 14px',
              borderRadius: '12px',
              border: '1px solid #1e283d'
            }}>
              {totalScore.toLocaleString()} ball
            </div>

            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="btn-solid-secondary"
              style={{ padding: '8px 12px', borderRadius: '10px' }}
              title="Chatni ko'rsatish/yashirish"
            >
              <MessageSquare size={16} />
            </button>
          </div>
        </div>

        {/* 🛣️ INTERACTIVE RACE TRACK / TEAM ROAD (Yo'l & Qadam Yurish) */}
        <div style={{
          background: '#121826',
          border: '1px solid #1e283d',
          borderRadius: '18px',
          padding: '16px',
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
            paddingBottom: '8px',
            borderBottom: '1px solid #1e283d'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '800', color: '#cbd5e1' }}>
              <span>🏁</span>
              <span>Poyga Yo'li (Har to'g'ri javob = 1 qadam oldinga)</span>
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Effektingiz:</span>
              <span style={{ color: currentTrailItem.color, fontWeight: '800' }}>
                {currentTrailItem.icon} {currentTrailItem.name}
              </span>
            </div>
          </div>

          {/* Track Road Lanes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {trackRacers.map((racer) => {
              const currentStep = playerSteps[racer.id || racer.name] || 0;
              const stepPercent = Math.min((currentStep / totalSteps) * 90, 90);
              const isMoving = !!activeTrails[racer.id || racer.name];
              const isMe = racer.name === user.name;

              return (
                <div
                  key={racer.id || racer.name}
                  style={{
                    position: 'relative',
                    height: '48px',
                    background: '#0e1422',
                    borderRadius: '12px',
                    border: '1px solid #1e283d',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 12px'
                  }}
                >
                  {/* Road Asphalt lines */}
                  <div style={{
                    position: 'absolute',
                    inset: '0 40px',
                    borderBottom: '2px dashed #222d42',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none'
                  }} />

                  {/* Finish Line Flag */}
                  <div style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '20px'
                  }}>
                    🏁
                  </div>

                  {/* Racer Character Token with Trail Effect */}
                  <div
                    style={{
                      position: 'absolute',
                      left: `calc(12px + ${stepPercent}%)`,
                      transition: 'left 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      zIndex: 5
                    }}
                  >
                    {/* Animated Trail Sparks when stepping */}
                    {isMoving && (
                      <div className="anim-pop" style={{
                        display: 'flex',
                        gap: '2px',
                        fontSize: '18px',
                        animation: 'fadeIn 0.5s ease infinite alternate'
                      }}>
                        {currentTrailItem.particle} {currentTrailItem.particle}
                      </div>
                    )}

                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: isMe ? '#4f46e5' : '#182234',
                      border: isMe ? '2px solid #818cf8' : '1px solid #222d42',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      boxShadow: isMoving ? `0 0 15px ${currentTrailItem.color}` : 'none'
                    }}>
                      {racer.avatar || '🦁'}
                    </div>

                    <div style={{
                      fontSize: '11px',
                      fontWeight: '800',
                      color: isMe ? '#818cf8' : '#f8fafc',
                      background: 'rgba(14, 20, 34, 0.9)',
                      padding: '2px 6px',
                      borderRadius: '6px',
                      border: '1px solid #1e283d',
                      whiteSpace: 'nowrap'
                    }}>
                      {racer.name} ({currentStep}/{totalSteps})
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Question Text Box */}
        <div style={{
          padding: '26px 20px',
          borderRadius: '18px',
          textAlign: 'center',
          background: '#121826',
          border: '1px solid #1e283d'
        }}>
          <h2 style={{
            fontSize: 'clamp(17px, 3.2vw, 24px)',
            fontWeight: '900',
            color: '#ffffff',
            lineHeight: 1.35,
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            {currentQuestion.question}
          </h2>
        </div>

        {/* Result Feedback Banner */}
        {isRevealed && (
          <div className="anim-pop" style={{
            padding: '12px 18px',
            borderRadius: '12px',
            background: isAnswerCorrect ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${isAnswerCorrect ? '#10b981' : '#ef4444'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: isAnswerCorrect ? '#10b981' : '#ef4444',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px'
              }}>
                {isAnswerCorrect ? <Check size={20} /> : <X size={20} />}
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: '800', color: '#ffffff' }}>
                  {isAnswerCorrect ? `To'g'ri Javob! (+${pointsEarned} Ball • +1 Qadam Oldinga)` : "Noto'g'ri Javob!"}
                </div>
                {currentQuestion.explanation && (
                  <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '2px' }}>
                    💡 {currentQuestion.explanation}
                  </div>
                )}
              </div>
            </div>

            <div style={{ fontSize: '12px', color: '#34d399', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={13} />
              <span>Keyingi savolga o'tilmoqda...</span>
            </div>
          </div>
        )}

        {/* 4 Solid Colored Kahoot Answer Buttons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          marginBottom: '10px'
        }}>
          {currentQuestion.options.map((opt, idx) => {
            const shapeInfo = SHAPES[idx] || SHAPES[0];
            const isSelected = selectedOptionIndex === idx;
            const isCorrect = opt.isCorrect;

            let btnBg = shapeInfo.color;
            let opacity = 1;
            let border = 'none';

            if (isRevealed) {
              if (isCorrect) {
                btnBg = shapeInfo.color;
                border = '2px solid #ffffff';
              } else {
                opacity = 0.3;
              }
            } else if (selectedOptionIndex !== null) {
              if (isSelected) {
                border = '2px solid #ffffff';
              } else {
                opacity = 0.45;
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={isRevealed || selectedOptionIndex !== null || isSpectator}
                style={{
                  background: btnBg,
                  opacity,
                  border,
                  borderRadius: '14px',
                  padding: '18px 16px',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textAlign: 'left',
                  cursor: (isRevealed || selectedOptionIndex !== null || isSpectator) ? 'default' : 'pointer',
                  minHeight: '76px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                  <span style={{ fontSize: '22px', fontWeight: '900', lineHeight: 1 }}>
                    {shapeInfo.shape}
                  </span>
                  <span style={{ fontSize: '15px', fontWeight: '800', lineHeight: 1.3 }}>
                    {opt.text}
                  </span>
                </div>

                {isRevealed && isCorrect && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'rgba(0,0,0,0.4)',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '800',
                    color: '#4ade80'
                  }}>
                    <Check size={16} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Floating Reaction Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#121826',
          border: '1px solid #1e283d',
          borderRadius: '14px',
          padding: '8px 16px',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '800', color: '#94a3b8' }}>
            <span>⚡ Jonli Reaksiyalar:</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {FLOATING_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleSendReaction(emoji)}
                style={{
                  fontSize: '20px',
                  background: '#182234',
                  border: '1px solid #222d42',
                  borderRadius: '10px',
                  padding: '5px 10px',
                  transition: 'transform 0.12s ease, background 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.25)';
                  e.currentTarget.style.background = '#222d42';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.background = '#182234';
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Reaction Emojis Layer during GamePlay */}
      <div style={{
        position: 'fixed',
        bottom: '90px',
        right: '40px',
        pointerEvents: 'none',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column-reverse',
        gap: '12px'
      }}>
        {floatingReactions.map((item) => (
          <div
            key={item.id}
            className="anim-pop"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(18, 24, 38, 0.94)',
              border: '1px solid #2f3e5c',
              padding: '6px 14px',
              borderRadius: '20px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              animation: 'floatUpAnim 2.4s ease-out forwards'
            }}
          >
            <span style={{ fontSize: '24px' }}>{item.emoji}</span>
            <span style={{ fontSize: '12px', fontWeight: '800', color: '#f8fafc' }}>{item.senderName}</span>
          </div>
        ))}
      </div>

      {/* RIGHT: LIVE REAL-TIME CHAT SIDEBAR */}
      {isChatOpen && (
        <div style={{ height: '700px', position: 'sticky', top: '80px' }}>
          <LiveChat
            roomPin={roomPin}
            currentUser={user}
            isHost={user.isHost}
            isSpectator={isSpectator}
            onClose={() => setIsChatOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
