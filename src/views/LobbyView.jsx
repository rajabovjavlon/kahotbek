import React, { useState } from 'react';
import { 
  Users, 
  Play, 
  Copy, 
  Check, 
  X, 
  ArrowLeft,
  MessageSquare
} from 'lucide-react';
import { soundManager } from '../utils/sounds';
import LiveChat from '../components/LiveChat';

export default function LobbyView({
  quiz,
  roomPin,
  players = [],
  isHost = true,
  user,
  onStartGame,
  onLeaveLobby,
  onRemovePlayer
}) {
  const [copied, setCopied] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);

  const handleCopyPin = () => {
    soundManager.playClick();
    navigator.clipboard?.writeText(roomPin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      maxWidth: '1440px',
      margin: '0 auto',
      padding: '20px 20px 60px',
      display: 'grid',
      gridTemplateColumns: isChatOpen ? '1fr 340px' : '1fr',
      gap: '20px',
      minHeight: '80vh',
      alignItems: 'start'
    }}>
      {/* LEFT: LOBBY & PLAYERS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Lobby Top Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <button
            onClick={() => {
              soundManager.playClick();
              onLeaveLobby();
            }}
            className="btn-solid-secondary"
            style={{ padding: '8px 16px', borderRadius: '10px' }}
          >
            <ArrowLeft size={16} />
            <span>Xonani Tark Etish</span>
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: '#121826',
            padding: '8px 16px',
            borderRadius: '12px',
            border: '1px solid #1e283d'
          }}>
            <span style={{ fontSize: '20px' }}>{quiz.icon || '🎯'}</span>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#ffffff' }}>{quiz.title}</div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>{quiz.questions?.length || 0} ta savol • {quiz.difficulty}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="btn-solid-secondary"
              style={{ padding: '8px 12px', borderRadius: '10px' }}
              title="Jonli chatni ochish"
            >
              <MessageSquare size={16} />
            </button>

            {/* Start Game Button (Host Only) */}
            {isHost ? (
              <button
                onClick={() => {
                  soundManager.playStartGame();
                  onStartGame();
                }}
                disabled={players.length === 0}
                className="btn-solid-primary"
                style={{
                  padding: '10px 24px',
                  fontSize: '14px',
                  borderRadius: '12px',
                  opacity: players.length === 0 ? 0.6 : 1
                }}
              >
                <Play size={16} fill="#fff" />
                <span>O'yinni Boshlash ({players.length} o'yinchi)</span>
              </button>
            ) : (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(2, 132, 199, 0.12)',
                border: '1px solid rgba(2, 132, 199, 0.3)',
                padding: '8px 14px',
                borderRadius: '10px',
                color: '#38bdf8',
                fontSize: '13px',
                fontWeight: '700'
              }}>
                <span className="pulse-dot" />
                <span>Host boshlashini kuting...</span>
              </div>
            )}
          </div>
        </div>

        {/* Center PIN Banner */}
        <div style={{
          padding: '28px 20px',
          borderRadius: '18px',
          textAlign: 'center',
          background: '#121826',
          border: '1px solid #1e283d'
        }}>
          <div style={{
            color: '#94a3b8',
            fontSize: '12px',
            fontWeight: '700',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.06em'
          }}>
            Do'stlaringiz ulanishi uchun PIN kod:
          </div>

          <div 
            onClick={handleCopyPin}
            style={{
              fontSize: 'clamp(36px, 6vw, 56px)',
              fontWeight: '900',
              letterSpacing: '6px',
              fontFamily: 'var(--font-mono)',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '14px',
              padding: '6px 20px',
              borderRadius: '14px',
              background: '#0e1422',
              border: '1px solid #222d42'
            }}
            title="PIN koddan nusxa olish"
          >
            <span>{roomPin}</span>
            <span style={{ fontSize: '20px', color: copied ? '#10b981' : '#94a3b8' }}>
              {copied ? <Check size={22} /> : <Copy size={22} />}
            </span>
          </div>

          <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '10px' }}>
            📱 Saytda <strong>PIN bilan kirish</strong> tugmasiga bosing va <span style={{ color: '#38bdf8', fontWeight: '800' }}>{roomPin}</span> kodini kiriting!
          </div>
        </div>

        {/* Real Players Section */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '14px',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} color="#10b981" />
              <h2 style={{ fontSize: '17px', fontWeight: '800', color: '#ffffff' }}>
                Xonadagi O'yinchilar ({players.length})
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
              <span>Real-Time Jonli Xona</span>
            </div>
          </div>

          {/* Players Grid */}
          {players.length === 0 ? (
            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
              borderRadius: '16px',
              background: '#121826',
              border: '1px dashed #1e283d'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>⏳</div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#ffffff', marginBottom: '4px' }}>
                O'yinchilar ulanishi kutilmoqda...
              </div>
              <p style={{ fontSize: '12px', color: '#94a3b8' }}>
                Do'stlaringizga {roomPin} PIN kodini bering
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '12px'
            }}>
              {players.map((p, idx) => (
                <div
                  key={p.id || idx}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#121826',
                    border: '1px solid #1e283d'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: '#182234',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      flexShrink: 0
                    }}>
                      {p.avatar || '🦁'}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{
                        fontSize: '13px',
                        fontWeight: '800',
                        color: '#ffffff',
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
                        padding: '4px'
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

      {/* RIGHT: LIVE CHAT SIDEBAR */}
      {isChatOpen && (
        <div style={{ height: '620px', position: 'sticky', top: '80px' }}>
          <LiveChat
            roomPin={roomPin}
            currentUser={user}
            isHost={isHost}
            onClose={() => setIsChatOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
