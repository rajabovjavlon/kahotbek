import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, 
  Award, 
  Flame, 
  Check, 
  X, 
  ChevronRight, 
  Trophy, 
  Zap, 
  Users,
  Volume2,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { soundManager } from '../utils/sounds';
import { fireQuickStreakConfetti } from '../utils/confetti';

const SHAPES = [
  { shape: '▲', color: '#ef4444', name: 'Qizil Uchburchak' },
  { shape: '◆', color: '#3b82f6', name: "Ko'k Romb" },
  { shape: '●', color: '#f59e0b', name: 'Sariq Aylana' },
  { shape: '■', color: '#10b981', name: 'Yashil Kvadrat' },
];

export default function GamePlayView({
  quiz,
  players,
  user,
  onFinishGame
}) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  // Game phases: 'intro' (3-2-1), 'question' (active timer & choosing), 'revealed' (showing correct answer & user feedback), 'leaderboard' (mid-game standings)
  const [phase, setPhase] = useState('intro');
  const [introCount, setIntroCount] = useState(3);
  
  const currentQuestion = quiz.questions[currentQIndex];
  const [timeLeft, setTimeLeft] = useState(currentQuestion?.timeLimit || 20);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [streak, setStreak] = useState(0);

  // Local mutable score tracking for user & bots
  const [gamePlayers, setGamePlayers] = useState(() => {
    return players.map(p => ({
      ...p,
      currentScore: 0,
      streak: 0,
      lastAnswer: null,
      lastCorrect: false,
      lastPoints: 0
    }));
  });

  // Answer distribution counts for the bar chart
  const [answerStats, setAnswerStats] = useState([0, 0, 0, 0]);

  // Ref to track if user already answered current question
  const hasAnsweredRef = useRef(false);

  // 1. Intro 3-2-1 countdown effect
  useEffect(() => {
    if (phase === 'intro') {
      soundManager.playTick(true);
      if (introCount > 1) {
        const timer = setTimeout(() => {
          setIntroCount(c => c - 1);
        }, 800);
        return () => clearTimeout(timer);
      } else if (introCount === 1) {
        const timer = setTimeout(() => {
          setIntroCount(0);
          setPhase('question');
          setTimeLeft(currentQuestion?.timeLimit || 20);
          hasAnsweredRef.current = false;
          setSelectedOptionIndex(null);
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, [phase, introCount, currentQuestion]);

  // 2. Question active countdown timer
  useEffect(() => {
    if (phase === 'question') {
      if (timeLeft > 0) {
        soundManager.playTick(timeLeft <= 5);
        const timer = setTimeout(() => {
          setTimeLeft(t => t - 1);
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        // Time ran out!
        handleTimeExpired();
      }
    }
  }, [phase, timeLeft]);

  // Handle when time runs out or user locks answer
  const handleTimeExpired = () => {
    revealResults(selectedOptionIndex);
  };

  // User selects an option
  const handleSelectOption = (optIdx) => {
    if (phase !== 'question' || hasAnsweredRef.current) return;
    hasAnsweredRef.current = true;
    setSelectedOptionIndex(optIdx);
    soundManager.playSelectAnswer();

    // Auto reveal or wait 1 second
    setTimeout(() => {
      revealResults(optIdx);
    }, 600);
  };

  // Reveal results and simulate bot performance
  const revealResults = (userChoice) => {
    const correctIdx = currentQuestion.options.findIndex(o => o.isCorrect);
    const userIsCorrect = userChoice === correctIdx;
    
    // Calculate user points based on speed
    const maxPoints = currentQuestion.points || 1000;
    const timeFactor = (timeLeft / (currentQuestion.timeLimit || 20));
    const earned = userIsCorrect ? Math.round(maxPoints * (0.5 + 0.5 * timeFactor)) : 0;

    setIsAnswerCorrect(userIsCorrect);
    setPointsEarned(earned);

    if (userIsCorrect) {
      soundManager.playCorrect();
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak >= 2) {
        fireQuickStreakConfetti();
        soundManager.playStreak();
      }
    } else {
      soundManager.playWrong();
      setStreak(0);
    }

    // Simulate Bot choices and calculate distribution
    const stats = [0, 0, 0, 0];
    if (userChoice !== null && userChoice >= 0 && userChoice < 4) {
      stats[userChoice]++;
    }

    const updatedPlayers = gamePlayers.map(p => {
      if (!p.isBot && p.name === user.name) {
        return {
          ...p,
          currentScore: p.currentScore + earned,
          streak: userIsCorrect ? p.streak + 1 : 0,
          lastAnswer: userChoice,
          lastCorrect: userIsCorrect,
          lastPoints: earned
        };
      }

      if (p.isBot) {
        // Bot intelligence: 70% chance to pick correct
        const botCorrect = Math.random() < 0.72;
        const botChoice = botCorrect ? correctIdx : Math.floor(Math.random() * currentQuestion.options.length);
        const botPoints = botCorrect ? Math.round(maxPoints * (0.4 + 0.5 * Math.random())) : 0;
        
        if (botChoice >= 0 && botChoice < 4) stats[botChoice]++;

        return {
          ...p,
          currentScore: p.currentScore + botPoints,
          streak: botCorrect ? p.streak + 1 : 0,
          lastAnswer: botChoice,
          lastCorrect: botCorrect,
          lastPoints: botPoints
        };
      }

      return p;
    });

    setAnswerStats(stats);
    setGamePlayers(updatedPlayers);
    setPhase('revealed');
  };

  // Next step: show mid-leaderboard or next question
  const handleProceedFromRevealed = () => {
    soundManager.playClick();
    setPhase('leaderboard');
  };

  // Next question or complete game
  const handleNextQuestion = () => {
    soundManager.playClick();
    if (currentQIndex + 1 < quiz.questions.length) {
      setCurrentQIndex(c => c + 1);
      setIntroCount(3);
      setPhase('intro');
    } else {
      // Game ended! Finalize and go to podium
      soundManager.playFanfare();
      onFinishGame(gamePlayers.sort((a, b) => b.currentScore - a.currentScore));
    }
  };

  // Sort players for leaderboard
  const sortedLeaderboard = [...gamePlayers].sort((a, b) => b.currentScore - a.currentScore);

  // 1. INTRO SCREEN
  if (phase === 'intro') {
    return (
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '20px'
      }}>
        <div style={{
          fontSize: '18px',
          fontWeight: '800',
          color: '#38bdf8',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: '16px'
        }}>
          Savol {currentQIndex + 1} / {quiz.questions.length}
        </div>

        <div className="anim-pop" style={{
          fontSize: 'clamp(80px, 15vw, 140px)',
          fontWeight: '900',
          background: 'linear-gradient(135deg, #a855f7 0%, #38bdf8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 0 35px rgba(139, 92, 246, 0.6))',
          lineHeight: 1,
          marginBottom: '20px'
        }}>
          {introCount}
        </div>

        <div style={{ fontSize: '24px', fontWeight: '800', color: '#fff' }}>
          Tayyorlaning! Savol kelmoqda...
        </div>
      </div>
    );
  }

  // 2. MID-GAME LEADERBOARD SCREEN
  if (phase === 'leaderboard') {
    return (
      <div style={{
        maxWidth: '850px',
        margin: '0 auto',
        padding: '30px 20px 60px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            padding: '6px 16px',
            borderRadius: '9999px',
            color: '#fbbf24',
            fontSize: '13px',
            fontWeight: '800',
            textTransform: 'uppercase',
            marginBottom: '10px'
          }}>
            <Trophy size={16} />
            <span>Oraliq Reyting ({currentQIndex + 1} / {quiz.questions.length})</span>
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#fff' }}>
            Peshqadamlar Jadvali
          </h2>
        </div>

        {/* Standings List */}
        <div className="glass-panel" style={{
          padding: '20px',
          borderRadius: '24px',
          marginBottom: '30px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {sortedLeaderboard.slice(0, 6).map((p, rank) => {
            const isUser = p.name === user.name;
            return (
              <div
                key={p.id || rank}
                className="anim-pop"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 20px',
                  borderRadius: '16px',
                  background: isUser 
                    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(6, 182, 212, 0.2))' 
                    : (rank === 0 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.04)'),
                  border: isUser ? '2px solid #8b5cf6' : (rank === 0 ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(255, 255, 255, 0.06)')
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  {/* Rank badge */}
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: rank === 0 ? '#f59e0b' : (rank === 1 ? '#94a3b8' : (rank === 2 ? '#b45309' : 'rgba(255,255,255,0.1)')),
                    color: rank < 3 ? '#000' : '#fff',
                    fontWeight: '900',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px'
                  }}>
                    {rank + 1}
                  </div>

                  <div style={{ fontSize: '24px' }}>{p.avatar || '⚡'}</div>

                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>{p.name}</span>
                      {isUser && (
                        <span style={{ fontSize: '10px', background: '#8b5cf6', padding: '2px 6px', borderRadius: '6px' }}>SIZ</span>
                      )}
                    </div>
                    {p.streak >= 2 && (
                      <div style={{ fontSize: '11px', color: '#f97316', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <Flame size={12} fill="#f97316" />
                        <span>{p.streak}x ketma-ket to'g'ri!</span>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '18px', fontWeight: '900', color: '#38bdf8' }}>
                    {p.currentScore.toLocaleString()} ball
                  </div>
                  {p.lastPoints > 0 && (
                    <div style={{ fontSize: '12px', color: '#10b981', fontWeight: '700' }}>
                      +{p.lastPoints}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Continue Button */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handleNextQuestion}
            className="btn-neon-primary"
            style={{
              padding: '14px 40px',
              fontSize: '16px',
              borderRadius: '16px'
            }}
          >
            <span>{currentQIndex + 1 < quiz.questions.length ? "Keyingi Savolga O'tish" : "Yakuniy Natijalarni Ko'rish"}</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // 3. MAIN GAME SCREEN (Active question or Revealed result)
  const isRevealed = phase === 'revealed';
  const correctOptionIndex = currentQuestion.options.findIndex(o => o.isCorrect);

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px 20px 60px',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '85vh',
      justifyContent: 'space-between'
    }}>
      {/* Top Status Bar: Question Progress, Circular Countdown Timer, Streak Indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Question Counter */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '8px 16px',
          borderRadius: '14px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <span style={{ fontSize: '16px' }}>⚡</span>
          <span style={{ fontSize: '14px', fontWeight: '800', color: '#fff' }}>
            Savol {currentQIndex + 1} / {quiz.questions.length}
          </span>
        </div>

        {/* Circular Countdown Timer */}
        <div style={{
          position: 'relative',
          width: '74px',
          height: '74px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
            <circle
              cx="37"
              cy="37"
              r="30"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="37"
              cy="37"
              r="30"
              stroke={timeLeft <= 5 ? '#ef4444' : '#06b6d4'}
              strokeWidth="6"
              fill="transparent"
              strokeDasharray="188.4"
              strokeDashoffset={188.4 * (1 - timeLeft / (currentQuestion.timeLimit || 20))}
              style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease' }}
            />
          </svg>
          <span style={{
            position: 'absolute',
            fontSize: '22px',
            fontWeight: '900',
            fontFamily: 'var(--font-mono)',
            color: timeLeft <= 5 ? '#ef4444' : '#fff'
          }}>
            {timeLeft}
          </span>
        </div>

        {/* User Streak & Score indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '8px 16px',
          borderRadius: '14px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          {streak >= 2 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f97316', fontWeight: '800', fontSize: '13px' }}>
              <Flame size={16} fill="#f97316" />
              <span>{streak}x Combo</span>
            </div>
          )}
          <div style={{ fontSize: '14px', fontWeight: '800', color: '#38bdf8' }}>
            {gamePlayers.find(p => p.name === user.name)?.currentScore || 0} ball
          </div>
        </div>
      </div>

      {/* Main Question Box */}
      <div className="glass-panel anim-fade" style={{
        padding: '36px 28px',
        borderRadius: '26px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(17, 22, 37, 0.95), rgba(15, 23, 42, 0.95))',
        border: '1px solid rgba(139, 92, 246, 0.25)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
        marginBottom: '24px'
      }}>
        <h2 style={{
          fontSize: 'clamp(20px, 4vw, 30px)',
          fontWeight: '900',
          color: '#ffffff',
          lineHeight: 1.35,
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          {currentQuestion.question}
        </h2>
      </div>

      {/* Result feedback notification (if revealed) */}
      {isRevealed && (
        <div className="anim-pop" style={{
          padding: '16px 24px',
          borderRadius: '18px',
          background: isAnswerCorrect 
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(5, 150, 105, 0.35))'
            : 'linear-gradient(135deg, rgba(239, 68, 68, 0.25), rgba(185, 28, 28, 0.35))',
          border: `2px solid ${isAnswerCorrect ? '#10b981' : '#ef4444'}`,
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: isAnswerCorrect ? '#10b981' : '#ef4444',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px'
            }}>
              {isAnswerCorrect ? <Check size={26} /> : <X size={26} />}
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: '900', color: '#fff' }}>
                {isAnswerCorrect ? `To'g'ri Javob! (+${pointsEarned} Ball)` : "Noto'g'ri Javob!"}
              </div>
              {currentQuestion.explanation && (
                <div style={{ fontSize: '13px', color: '#e2e8f0', marginTop: '2px' }}>
                  💡 {currentQuestion.explanation}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleProceedFromRevealed}
            className="btn-neon-primary"
            style={{ padding: '10px 24px', borderRadius: '12px' }}
          >
            <span>Davom Etish</span>
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* 4 Colored Kahoot Answer Buttons */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px',
        marginBottom: '10px'
      }}>
        {currentQuestion.options.map((opt, idx) => {
          const shapeInfo = SHAPES[idx] || SHAPES[0];
          const isSelected = selectedOptionIndex === idx;
          const isCorrect = opt.isCorrect;

          let btnBg = shapeInfo.color;
          let opacity = 1;
          let transform = 'none';
          let border = 'none';

          if (isRevealed) {
            if (isCorrect) {
              btnBg = shapeInfo.color;
              border = '3px solid #ffffff';
              transform = 'scale(1.02)';
            } else {
              opacity = 0.35;
            }
          } else if (selectedOptionIndex !== null) {
            if (isSelected) {
              border = '3px solid #ffffff';
              transform = 'scale(1.02)';
            } else {
              opacity = 0.5;
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelectOption(idx)}
              disabled={isRevealed || selectedOptionIndex !== null}
              style={{
                background: btnBg,
                opacity,
                transform,
                border,
                borderRadius: '20px',
                padding: '22px 20px',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                textAlign: 'left',
                boxShadow: `0 8px 25px ${shapeInfo.color}40`,
                cursor: (isRevealed || selectedOptionIndex !== null) ? 'default' : 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                minHeight: '90px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                <span style={{
                  fontSize: '28px',
                  fontWeight: '900',
                  lineHeight: 1,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                }}>
                  {shapeInfo.shape}
                </span>
                <span style={{
                  fontSize: '18px',
                  fontWeight: '800',
                  lineHeight: 1.3
                }}>
                  {opt.text}
                </span>
              </div>

              {/* Reveal indicator / answer count */}
              {isRevealed && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(0,0,0,0.4)',
                  padding: '4px 10px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '800'
                }}>
                  {isCorrect ? <Check size={18} color="#4ade80" /> : <X size={18} color="#fca5a5" />}
                  <span>{answerStats[idx]} ta</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
