import React, { useState } from 'react';
import { X, Play, Hash, User, Sparkles, ShieldCheck } from 'lucide-react';
import { ANIMAL_AVATARS } from '../data/animals';
import { soundManager } from '../utils/sounds';

export default function JoinModal({ isOpen, onClose, onJoinGame }) {
  const [pin, setPin] = useState('');
  const [nickname, setNickname] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(ANIMAL_AVATARS[0].emoji);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleKeypadPress = (num) => {
    soundManager.playClick();
    if (pin.length < 6) {
      setPin(prev => prev + num);
      setError('');
    }
  };

  const handleBackspace = () => {
    soundManager.playClick();
    setPin(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    soundManager.playClick();
    setPin('');
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!pin || pin.length < 4) {
      soundManager.playWrong();
      setError("Iltimos, to'g'ri PIN kodni kiriting (kamida 4-6 ta raqam)");
      return;
    }
    if (!nickname.trim()) {
      soundManager.playWrong();
      setError("Iltimos, ismingiz yoki taxallusingizni kiriting!");
      return;
    }

    soundManager.playCorrect();
    onJoinGame({
      pin: pin.trim(),
      nickname: nickname.trim(),
      avatar: selectedAvatar
    });
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      backgroundColor: 'rgba(5, 7, 15, 0.88)',
      backdropFilter: 'blur(14px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel anim-pop" style={{
        width: '100%',
        maxWidth: '480px',
        background: '#111625',
        border: '1px solid rgba(139, 92, 246, 0.35)',
        borderRadius: '24px',
        padding: '28px',
        position: 'relative',
        boxShadow: '0 25px 60px rgba(0,0,0,0.85), 0 0 45px rgba(139, 92, 246, 0.25)',
        maxHeight: '92vh',
        overflowY: 'auto'
      }}>
        {/* Close Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.08)',
            color: '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
            fontSize: '28px',
            marginBottom: '10px',
            boxShadow: '0 0 25px rgba(6, 182, 212, 0.5)'
          }}>
            🎮
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#fff' }}>
            Jonli Xonaga Ulanish
          </h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '2px' }}>
            PIN kodni kiriting va hayvon avataringizni tanlang
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#fca5a5',
            padding: '10px 14px',
            borderRadius: '12px',
            fontSize: '13px',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* PIN Input display */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>
              O'yin PIN Kodi
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: '#090c15',
              border: '2px solid rgba(6, 182, 212, 0.4)',
              borderRadius: '14px',
              padding: '8px 14px',
              gap: '10px'
            }}>
              <Hash size={20} color="#06b6d4" />
              <input
                type="text"
                placeholder="PIN (Masalan: 742819)"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value.replace(/\D/g, '').slice(0, 6));
                  setError('');
                }}
                maxLength={6}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontSize: '20px',
                  fontWeight: '800',
                  letterSpacing: '3px',
                  fontFamily: 'var(--font-mono)'
                }}
              />
            </div>
          </div>

          {/* Quick PIN Keypad */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '6px',
            marginBottom: '16px'
          }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <button
                type="button"
                key={n}
                onClick={() => handleKeypadPress(n.toString())}
                style={{
                  padding: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  fontSize: '17px',
                  fontWeight: '700',
                  color: '#f8fafc'
                }}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClear}
              style={{
                padding: '8px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: '700',
                color: '#fca5a5'
              }}
            >
              Tozalash
            </button>
            <button
              type="button"
              onClick={() => handleKeypadPress('0')}
              style={{
                padding: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                fontSize: '17px',
                fontWeight: '700',
                color: '#f8fafc'
              }}
            >
              0
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              style={{
                padding: '8px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '700',
                color: '#cbd5e1'
              }}
            >
              ⌫
            </button>
          </div>

          {/* Nickname input */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>
              Ismingiz (Username)
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: '#090c15',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '8px 12px',
              gap: '10px'
            }}>
              <User size={16} color="#94a3b8" />
              <input
                type="text"
                placeholder="Ismingizni yozing..."
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  setError('');
                }}
                maxLength={20}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              />
            </div>
          </div>

          {/* Animal Avatar selector */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
              Hayvon Avatari Tanlang
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '6px',
              maxHeight: '140px',
              overflowY: 'auto'
            }}>
              {ANIMAL_AVATARS.map((an) => {
                const isSel = selectedAvatar === an.emoji;
                return (
                  <button
                    type="button"
                    key={an.id}
                    onClick={() => {
                      soundManager.playClick();
                      setSelectedAvatar(an.emoji);
                    }}
                    style={{
                      padding: '6px',
                      borderRadius: '10px',
                      background: isSel ? 'rgba(139, 92, 246, 0.35)' : 'rgba(255, 255, 255, 0.04)',
                      border: isSel ? '2px solid #8b5cf6' : '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>{an.emoji}</span>
                    <span style={{ fontSize: '11px', color: isSel ? '#c084fc' : '#94a3b8', fontWeight: '700' }}>
                      {an.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="btn-neon-primary"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '15px',
              borderRadius: '14px'
            }}
          >
            <Play size={16} fill="#fff" />
            <span>Xonaga Qo'shilish (Real-Time)</span>
          </button>
        </form>
      </div>
    </div>
  );
}
