import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, 
  Flame, 
  Check, 
  X, 
  Trophy, 
  Zap, 
  Sparkles,
  ArrowRight
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
  players = [],
  user,
  onFinishGame
}) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [phase, setPhase] = useState('intro'); // 'intro', 'question', 'revealed'
  const [introCount, setIntroCount] = useState(3);
  
  const currentQuestion = quiz.questions[currentQIndex] || quiz.questions[0];
  const [timeLeft, setTimeLeft] = useState(currentQuestion?.timeLimit || 20);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalScore, setTotalScore] = useState(0);

  // Auto transition timer ref
  const autoNextTimerRef = useRef(null);
  const hasAnsweredRef = useRef(false);

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
        // Time ran out! Immediately reveal and auto advance
        handleTimeExpired();
      }
    }
  }, [phase, timeLeft]);

  // Cleanup auto next timer on unmount
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

  // User selects an option
  const handleSelectOption = (optIdx) => {
    if (phase !== 'question' || hasAnsweredRef.current) return;
    hasAnsweredRef.current = true;
    setSelectedOptionIndex(optIdx);
    soundManager.playSelectAnswer();

    revealAndAutoAdvance(optIdx);
  };

  // Reveal results and automatically advance to next question in 1.8s
  const revealAndAutoAdvance = (userChoice) => {
    const correctIdx = currentQuestion.options.findIndex(o => o.isCorrect);
    const userIsCorrect = userChoice === correctIdx;
    
    // Calculate points based on speed
    const maxPoints = currentQuestion.points || 1000;
    const timeFactor = Math.max(0, timeLeft / (currentQuestion.timeLimit || 20));
    const earned = userIsCorrect ? Math.round(maxPoints * (0.5 + 0.5 * timeFactor)) : 0;

    setIsAnswerCorrect(userIsCorrect);
    setPointsEarned(earned);

    let newTotalScore = totalScore;
    let newCorrectCount = correctCount;
    let newStreak = streak;

    if (userIsCorrect) {
      soundManager.playCorrect();
      newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
      newCorrectCount = correctCount + 1;
      setCorrectCount(newCorrectCount);
      newTotalScore = totalScore + earned;
      setTotalScore(newTotalScore);

      if (newStreak >= 2) {
        fireQuickStreakConfetti();
        soundManager.playStreak();
      }
    } else {
      soundManager.playWrong();
      setStreak(0);
    }

    setPhase('revealed');

    // AUTOMATIC FAST TRANSITION TO NEXT QUESTION (1.8s)
    autoNextTimerRef.current = setTimeout(() => {
      if (currentQIndex + 1 < quiz.questions.length) {
        setCurrentQIndex(c => c + 1);
        setIntroCount(3);
        setPhase('intro');
      } else {
        // Game ended! Go to Victory Podium with exact stats
        soundManager.playFanfare();
        const finalStandings = [
          {
            name: user.name,
            username: user.username || `@${user.name.toLowerCase().replace(/\s+/g, '_')}`,
            avatar: user.avatar || '🦁',
            currentScore: newTotalScore,
            correctCount: newCorrectCount,
            totalQuestions: quiz.questions.length,
            maxStreak: Math.max(newStreak, maxStreak)
          }
        ];
        onFinishGame(finalStandings);
      }
    }, 1800);
  };

  // 1. INTRO 3-2-1 SCREEN
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

  // 2. MAIN ACTIVE QUESTION & REVEAL SCREEN
  const isRevealed = phase === 'revealed';

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
      {/* Top Status Bar: Question Number, Circular Timer, Live Score & Streak */}
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
          <span style={{ fontSize: '18px' }}>⚡</span>
          <span style={{ fontSize: '15px', fontWeight: '800', color: '#fff' }}>
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

        {/* Live Score and Streak */}
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
          <div style={{ fontSize: '15px', fontWeight: '800', color: '#38bdf8' }}>
            {totalScore.toLocaleString()} ball
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

      {/* Fast Result Feedback Banner */}
      {isRevealed && (
        <div className="anim-pop" style={{
          padding: '16px 24px',
          borderRadius: '18px',
          background: isAnswerCorrect 
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(5, 150, 105, 0.4))'
            : 'linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(185, 28, 28, 0.4))',
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

          <div style={{ fontSize: '12px', color: '#a7f3d0', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={14} />
            <span>Keyingi savolga o'tilmoqda...</span>
          </div>
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

              {isRevealed && isCorrect && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(0,0,0,0.4)',
                  padding: '4px 10px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '800',
                  color: '#4ade80'
                }}>
                  <Check size={18} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
