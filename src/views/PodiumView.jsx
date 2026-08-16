import React, { useEffect } from 'react';
import { 
  Trophy, 
  Crown, 
  Sparkles, 
  RotateCcw, 
  Home, 
  Gamepad2,
  Award,
  Zap,
  CheckCircle2,
  Flame
} from 'lucide-react';
import { fireVictoryConfetti } from '../utils/confetti';
import { soundManager } from '../utils/sounds';

export default function PodiumView({
  quiz,
  finalScores = [],
  user,
  onPlayAgain,
  onGoHome,
  onGoExplore
}) {
  useEffect(() => {
    fireVictoryConfetti();
    soundManager.playFanfare();
  }, []);

  const playerStats = finalScores[0] || {
    name: user.name,
    username: user.username || '@user',
    avatar: user.avatar || '🦁',
    currentScore: user.xp || 1000,
    correctCount: quiz?.questions?.length || 5,
    totalQuestions: quiz?.questions?.length || 5,
    maxStreak: 3
  };

  const totalQuestions = quiz?.questions?.length || 5;
  const accuracy = Math.round(((playerStats.correctCount || 0) / totalQuestions) * 100);

  return (
    <div style={{
      maxWidth: '1050px',
      margin: '0 auto',
      padding: '24px 20px 80px',
      textAlign: 'center'
    }}>
      {/* Title */}
      <div className="anim-fade" style={{ marginBottom: '28px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          background: 'rgba(245, 158, 11, 0.15)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '9999px',
          color: '#fbbf24',
          fontSize: '13px',
          fontWeight: '800',
          textTransform: 'uppercase',
          marginBottom: '10px'
        }}>
          <Sparkles size={16} />
          <span>O'yin Muvaffaqiyatli Yakunlandi!</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(28px, 6vw, 44px)',
          fontWeight: '900',
          color: '#fff',
          letterSpacing: '-0.02em'
        }}>
          Tabriklaymiz! Siz G'olibsiz! 🏆
        </h1>
        <p style={{ fontSize: '15px', color: '#94a3b8', marginTop: '4px' }}>
          {quiz.title}
        </p>
      </div>

      {/* 3D RISING BLOCKS PODIUM WITH ANIMAL CELEBRATION ANIMATION */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: '20px',
        maxWidth: '750px',
        margin: '0 auto 36px',
        paddingBottom: '20px'
      }}>
        {/* 2nd Place Silver Column */}
        <div className="anim-pop" style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animationDelay: '0.2s'
        }}>
          <div style={{
            fontSize: '36px',
            marginBottom: '6px',
            filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.5))'
          }}>
            🥈
          </div>
          <div style={{ fontSize: '14px', fontWeight: '800', color: '#cbd5e1', marginBottom: '8px' }}>
            2-O'RIN
          </div>
          {/* Silver Block */}
          <div style={{
            width: '100%',
            height: '140px',
            background: 'linear-gradient(180deg, rgba(148, 163, 184, 0.4) 0%, rgba(51, 65, 85, 0.85) 100%)',
            border: '2px solid rgba(148, 163, 184, 0.6)',
            borderRadius: '20px 20px 0 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 12px 35px rgba(0,0,0,0.5)'
          }}>
            <div style={{ fontSize: '38px', fontWeight: '900', color: '#cbd5e1' }}>2</div>
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#94a3b8' }}>KUMUSH</div>
          </div>
        </div>

        {/* 1st Place Gold Champion (TALLEST WITH ANIMAL AVATAR LIFTING TROPHY) */}
        <div className="anim-pop" style={{
          flex: 1.3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 2
        }}>
          {/* Animated Crown */}
          <div style={{
            fontSize: '32px',
            color: '#fbbf24',
            marginBottom: '-6px',
            animation: 'floatAnim 2.5s ease-in-out infinite'
          }}>
            👑
          </div>

          {/* Animal Avatar Jumping on Podium */}
          <div style={{
            fontSize: '56px',
            marginBottom: '4px',
            filter: 'drop-shadow(0 0 25px rgba(245, 158, 11, 0.7))',
            animation: 'floatAnim 3s ease-in-out infinite'
          }}>
            {user.avatar || playerStats.avatar || '🦁'}
          </div>

          <div style={{
            fontSize: '18px',
            fontWeight: '900',
            color: '#fbbf24',
            marginBottom: '4px'
          }}>
            {playerStats.name}
          </div>

          <div style={{
            fontSize: '16px',
            color: '#38bdf8',
            fontWeight: '900',
            marginBottom: '10px'
          }}>
            {playerStats.currentScore.toLocaleString()} BALL
          </div>

          {/* 1st Place Gold Pillar */}
          <div style={{
            width: '100%',
            height: '210px',
            background: 'linear-gradient(180deg, rgba(245, 158, 11, 0.45) 0%, rgba(180, 83, 9, 0.9) 100%)',
            border: '2px solid rgba(245, 158, 11, 0.8)',
            borderRadius: '24px 24px 0 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 15px 45px rgba(245, 158, 11, 0.35)'
          }}>
            <Trophy size={46} color="#fbbf24" style={{ marginBottom: '4px', filter: 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.8))' }} />
            <div style={{ fontSize: '44px', fontWeight: '900', color: '#fbbf24' }}>1</div>
            <div style={{ fontSize: '13px', fontWeight: '900', color: '#fef08a' }}>G'OLIB / CHEMPION</div>
          </div>
        </div>

        {/* 3rd Place Bronze Column */}
        <div className="anim-pop" style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animationDelay: '0.4s'
        }}>
          <div style={{
            fontSize: '36px',
            marginBottom: '6px',
            filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.5))'
          }}>
            🥉
          </div>
          <div style={{ fontSize: '14px', fontWeight: '800', color: '#d97706', marginBottom: '8px' }}>
            3-O'RIN
          </div>
          {/* Bronze Block */}
          <div style={{
            width: '100%',
            height: '110px',
            background: 'linear-gradient(180deg, rgba(180, 83, 9, 0.3) 0%, rgba(120, 53, 15, 0.8) 100%)',
            border: '2px solid rgba(180, 83, 9, 0.5)',
            borderRadius: '20px 20px 0 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            <div style={{ fontSize: '36px', fontWeight: '900', color: '#f59e0b' }}>3</div>
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#d97706' }}>BRONZA</div>
          </div>
        </div>
      </div>

      {/* DETAILED FINAL SCORE SUMMARY CARD */}
      <div className="glass-panel anim-fade" style={{
        maxWidth: '750px',
        margin: '0 auto 36px',
        padding: '24px',
        borderRadius: '24px',
        background: 'linear-gradient(135deg, rgba(17, 22, 37, 0.95), rgba(30, 27, 75, 0.85))',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        boxShadow: '0 15px 40px rgba(0,0,0,0.6)'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#cbd5e1', textTransform: 'uppercase', marginBottom: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Award size={18} color="#8b5cf6" />
          <span>Sizning Yakuniy Natijalaringiz</span>
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px'
        }}>
          {/* Total Points */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '14px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Jami To'plangan Ball</div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#38bdf8', marginTop: '2px' }}>
              {playerStats.currentScore.toLocaleString()}
            </div>
          </div>

          {/* Correct Answers */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '14px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>To'g'ri Javoblar</div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#10b981', marginTop: '2px' }}>
              {playerStats.correctCount} / {totalQuestions} <span style={{ fontSize: '13px', color: '#86efac' }}>({accuracy}%)</span>
            </div>
          </div>

          {/* Max Streak */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '14px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Eng Yuqori Streak</div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#f97316', marginTop: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <Flame size={18} fill="#f97316" />
              <span>{playerStats.maxStreak || 1}x</span>
            </div>
          </div>

          {/* Reward XP & Coins */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '14px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Mukofot</div>
            <div style={{ fontSize: '18px', fontWeight: '900', color: '#fbbf24', marginTop: '4px' }}>
              ⚡ +{playerStats.currentScore} XP • 🪙 +50
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '14px',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => {
            soundManager.playClick();
            onPlayAgain();
          }}
          className="btn-neon-primary"
          style={{ padding: '14px 28px', fontSize: '15px', borderRadius: '16px' }}
        >
          <RotateCcw size={18} />
          <span>Qayta O'ynash</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            onGoExplore();
          }}
          className="btn-neon-cyan"
          style={{ padding: '14px 28px', fontSize: '15px', borderRadius: '16px' }}
        >
          <Gamepad2 size={18} />
          <span>Boshqa O'yin Tanlash</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            onGoHome();
          }}
          className="btn-glass"
          style={{ padding: '14px 24px', fontSize: '15px', borderRadius: '16px' }}
        >
          <Home size={18} />
          <span>Bosh Sahifa</span>
        </button>
      </div>
    </div>
  );
}
