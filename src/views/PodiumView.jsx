import React, { useEffect } from 'react';
import { 
  Trophy, 
  Crown, 
  Sparkles, 
  RotateCcw, 
  Home, 
  Share2, 
  Gamepad2,
  Award,
  Zap
} from 'lucide-react';
import { fireVictoryConfetti } from '../utils/confetti';
import { soundManager } from '../utils/sounds';

export default function PodiumView({
  quiz,
  finalScores,
  user,
  onPlayAgain,
  onGoHome,
  onGoExplore
}) {
  useEffect(() => {
    fireVictoryConfetti();
    soundManager.playFanfare();
  }, []);

  const firstPlace = finalScores[0];
  const secondPlace = finalScores[1];
  const thirdPlace = finalScores[2];

  const isUserWinner = firstPlace?.name === user.name;

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '30px 20px 80px',
      textAlign: 'center'
    }}>
      {/* Title */}
      <div className="anim-fade" style={{ marginBottom: '36px' }}>
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
          marginBottom: '12px'
        }}>
          <Sparkles size={16} />
          <span>O'yin Yakunlandi!</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(32px, 6vw, 48px)',
          fontWeight: '900',
          color: '#fff',
          letterSpacing: '-0.02em'
        }}>
          {isUserWinner ? "Tabriklaymiz! Siz 1-o'rinni egalladingiz! 🏆" : "G'oliblar Tantanasi & Podium"}
        </h1>
        <p style={{ fontSize: '15px', color: '#94a3b8', marginTop: '6px' }}>
          {quiz.title} • {quiz.questions?.length || 0} ta savol
        </p>
      </div>

      {/* 3D PODIUM SECTION */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: '20px',
        maxWidth: '750px',
        margin: '0 auto 48px',
        paddingBottom: '20px'
      }}>
        {/* 2nd Place Podium */}
        {secondPlace && (
          <div className="anim-pop" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>{secondPlace.avatar || '🥈'}</div>
            <div style={{ fontSize: '15px', fontWeight: '800', color: '#fff', marginBottom: '4px', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {secondPlace.name}
            </div>
            <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '700', marginBottom: '10px' }}>
              {secondPlace.currentScore?.toLocaleString()} ball
            </div>
            {/* Podium Bar */}
            <div style={{
              width: '100%',
              height: '160px',
              background: 'linear-gradient(180deg, rgba(148, 163, 184, 0.4) 0%, rgba(51, 65, 85, 0.8) 100%)',
              border: '2px solid rgba(148, 163, 184, 0.5)',
              borderRadius: '20px 20px 0 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}>
              <div style={{ fontSize: '36px', fontWeight: '900', color: '#cbd5e1' }}>2</div>
              <div style={{ fontSize: '12px', fontWeight: '800', color: '#94a3b8' }}>KUMUSH</div>
            </div>
          </div>
        )}

        {/* 1st Place Podium (TALLEST) */}
        {firstPlace && (
          <div className="anim-pop" style={{ flex: 1.2, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
            <div style={{ fontSize: '28px', color: '#fbbf24', marginBottom: '-6px' }}>👑</div>
            <div style={{ fontSize: '42px', marginBottom: '8px', filter: 'drop-shadow(0 0 20px rgba(245, 158, 11, 0.6))' }}>
              {firstPlace.avatar || '🥇'}
            </div>
            <div style={{ fontSize: '18px', fontWeight: '900', color: '#fbbf24', marginBottom: '4px', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {firstPlace.name}
            </div>
            <div style={{ fontSize: '15px', color: '#38bdf8', fontWeight: '800', marginBottom: '12px' }}>
              {firstPlace.currentScore?.toLocaleString()} ball
            </div>
            {/* Podium Bar */}
            <div style={{
              width: '100%',
              height: '220px',
              background: 'linear-gradient(180deg, rgba(245, 158, 11, 0.4) 0%, rgba(180, 83, 9, 0.85) 100%)',
              border: '2px solid rgba(245, 158, 11, 0.7)',
              borderRadius: '24px 24px 0 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 15px 40px rgba(245, 158, 11, 0.3)'
            }}>
              <Trophy size={42} color="#fbbf24" style={{ marginBottom: '6px' }} />
              <div style={{ fontSize: '42px', fontWeight: '900', color: '#fbbf24' }}>1</div>
              <div style={{ fontSize: '13px', fontWeight: '900', color: '#fef08a' }}>CHEMPION</div>
            </div>
          </div>
        )}

        {/* 3rd Place Podium */}
        {thirdPlace && (
          <div className="anim-pop" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>{thirdPlace.avatar || '🥉'}</div>
            <div style={{ fontSize: '15px', fontWeight: '800', color: '#fff', marginBottom: '4px', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {thirdPlace.name}
            </div>
            <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '700', marginBottom: '10px' }}>
              {thirdPlace.currentScore?.toLocaleString()} ball
            </div>
            {/* Podium Bar */}
            <div style={{
              width: '100%',
              height: '120px',
              background: 'linear-gradient(180deg, rgba(180, 83, 9, 0.3) 0%, rgba(120, 53, 15, 0.75) 100%)',
              border: '2px solid rgba(180, 83, 9, 0.5)',
              borderRadius: '20px 20px 0 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}>
              <div style={{ fontSize: '32px', fontWeight: '900', color: '#f59e0b' }}>3</div>
              <div style={{ fontSize: '12px', fontWeight: '800', color: '#d97706' }}>BRONZA</div>
            </div>
          </div>
        )}
      </div>

      {/* Rewards Card */}
      <div className="glass-panel" style={{
        maxWidth: '650px',
        margin: '0 auto 36px',
        padding: '20px',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        border: '1px solid rgba(139, 92, 246, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ fontSize: '24px' }}>⚡</div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Mukofot XP</div>
            <div style={{ fontSize: '16px', fontWeight: '800', color: '#c084fc' }}>+350 XP</div>
          </div>
        </div>
        <div style={{ width: '1px', height: '36px', background: 'rgba(255,255,255,0.1)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ fontSize: '24px' }}>🪙</div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Yutib Olingan</div>
            <div style={{ fontSize: '16px', fontWeight: '800', color: '#fbbf24' }}>+50 Tanga</div>
          </div>
        </div>
        <div style={{ width: '1px', height: '36px', background: 'rgba(255,255,255,0.1)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ fontSize: '24px' }}>🎖️</div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Yangi Yutuq</div>
            <div style={{ fontSize: '16px', fontWeight: '800', color: '#34d399' }}>Podium Ustasi</div>
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
