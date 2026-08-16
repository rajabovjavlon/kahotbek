import React, { useState } from 'react';
import { 
  Users, 
  Play, 
  Copy, 
  Check, 
  Sparkles, 
  X, 
  ArrowLeft, 
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';
import { soundManager } from '../utils/sounds';

export default function LobbyView({
  quiz,
  roomPin,
  players = [],
  isHost = true,
  onStartGame,
  onLeaveLobby,
  onRemovePlayer
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyPin = () => {
    soundManager.playClick();
    navigator.clipboard?.writeText(roomPin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '30px 20px 80px',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '80vh',
      justifyContent: 'space-between'
    }}>
      {/* Lobby Top Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <button
          onClick={() => {
            soundManager.playClick();
            onLeaveLobby();
          }}
          className="btn-glass"
          style={{ padding: '8px 16px', borderRadius: '12px' }}
        >
          <ArrowLeft size={16} />
          <span>Xonani Tark Etish</span>
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '8px 16px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <span style={{ fontSize: '22px' }}>{quiz.icon || '🎯'}</span>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: '#fff' }}>{quiz.title}</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>{quiz.questions?.length || 0} ta savol • {quiz.difficulty}</div>
          </div>
        </div>

        {/* Start Game Button (Host Only) */}
        {isHost ? (
          <button
            onClick={() => {
              soundManager.playStartGame();
              onStartGame();
            }}
            disabled={players.length === 0}
            className="btn-neon-primary"
            style={{
              padding: '12px 32px',
              fontSize: '16px',
              borderRadius: '16px',
              opacity: players.length === 0 ? 0.6 : 1
            }}
          >
            <Play size={18} fill="#fff" />
            <span>O'yinni Boshlash ({players.length} o'yinchi)</span>
          </button>
        ) : (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(14, 165, 233, 0.15)',
            border: '1px solid rgba(14, 165, 233, 0.3)',
            padding: '8px 16px',
            borderRadius: '12px',
            color: '#38bdf8',
            fontSize: '13px',
            fontWeight: '700'
          }}>
            <span className="pulse-dot" />
            <span>Host o'yinni boshlashini kuting...</span>
          </div>
        )}
      </div>

      {/* Center PIN Banner */}
      <div className="glass-panel anim-pop" style={{
        padding: '36px 24px',
        borderRadius: '30px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.95), rgba(15, 23, 42, 0.98))',
        border: '2px solid rgba(139, 92, 246, 0.4)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 50px rgba(139, 92, 246, 0.25)',
        marginBottom: '36px',
        position: 'relative'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: '#38bdf8',
          fontSize: '14px',
          fontWeight: '700',
          marginBottom: '10px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}>
          <span>Do'stlaringiz ulanishi uchun PIN kod:</span>
        </div>

        {/* PIN digits */}
        <div 
          onClick={handleCopyPin}
          style={{
            fontSize: 'clamp(44px, 8vw, 76px)',
            fontWeight: '900',
            letterSpacing: '8px',
            fontFamily: 'var(--font-mono)',
            color: '#ffffff',
            textShadow: '0 0 30px rgba(6, 182, 212, 0.8), 0 0 60px rgba(139, 92, 246, 0.5)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '16px',
            padding: '6px 24px',
            borderRadius: '20px',
            background: 'rgba(0, 0, 0, 0.35)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
          title="PIN koddan nusxa olish"
        >
          <span>{roomPin}</span>
          <span style={{ fontSize: '24px', color: copied ? '#10b981' : '#94a3b8' }}>
            {copied ? <Check size={28} /> : <Copy size={28} />}
          </span>
        </div>

        <div style={{ fontSize: '14px', color: '#cbd5e1', marginTop: '14px' }}>
          📱 Do'stlaringiz brauzerda <strong>PIN bilan kirish</strong> tugmasini bosib, <span style={{ color: '#38bdf8', fontWeight: '800' }}>{roomPin}</span> kodini kiritishadi!
        </div>
      </div>

      {/* Real Players Section */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '18px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={22} color="#10b981" />
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#fff' }}>
              Xonadagi Haqiqiy O'yinchilar ({players.length})
            </h2>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            color: '#34d399',
            fontWeight: '700'
          }}>
            <span className="pulse-dot" />
            <span>Jonli ulanish faol (Real-time Socket)</span>
          </div>
        </div>

        {/* Players Grid */}
        {players.length === 0 ? (
          <div className="glass-panel" style={{
            padding: '50px 20px',
            textAlign: 'center',
            borderRadius: '20px',
            border: '2px dashed rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>⏳</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>
              Haqiqiy o'yinchilar ulanishi kutilmoqda...
            </div>
            <p style={{ fontSize: '14px', color: '#94a3b8' }}>
              Do'stlaringizga {roomPin} PIN kodini bering
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '14px'
          }}>
            {players.map((p, idx) => (
              <div
                key={p.id || idx}
                className="glass-card anim-pop"
                style={{
                  padding: '14px 16px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(17, 22, 37, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    flexShrink: 0
                  }}>
                    {p.avatar || '🦁'}
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{
                      fontSize: '15px',
                      fontWeight: '800',
                      color: '#f8fafc',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {p.name}
                    </div>
                    {p.isHost && (
                      <div style={{ fontSize: '10px', color: '#fbbf24', fontWeight: '800' }}>👑 XONA EGASI</div>
                    )}
                  </div>
                </div>

                {isHost && !p.isHost && onRemovePlayer && (
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      onRemovePlayer(p.id);
                    }}
                    style={{
                      background: 'transparent',
                      color: '#64748b',
                      padding: '4px',
                      borderRadius: '6px'
                    }}
                    title="Chiqarib yuborish"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
