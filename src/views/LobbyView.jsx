import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Play, 
  Copy, 
  Check, 
  X, 
  ArrowLeft,
  MessageSquare,
  Settings2,
  Volume2,
  Flame,
  Shuffle,
  Clock,
  HelpCircle,
  Sparkles,
  Trophy
} from 'lucide-react';
import { soundManager } from '../utils/sounds';
import LiveChat from '../components/LiveChat';
import { socket } from '../utils/socket';
import { prepareQuizQuestions } from '../data/defaultQuizzes';

const QUESTION_COUNTS = [5, 10, 15, 20, 30, 40, 50, 'all'];
const TIME_LIMITS = [10, 15, 20, 30];
const FLOATING_EMOJIS = ['🔥', '👏', '😂', '⚡', '😎', '🚀', '🎯', '🎉'];

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

  // Host Room Settings state
  const [questionCount, setQuestionCount] = useState(5);
  const [timeLimit, setTimeLimit] = useState(15);
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [gameMode, setGameMode] = useState('race'); // 'race' or 'classic'

  // Floating reactions state
  const [floatingReactions, setFloatingReactions] = useState([]);

  // Sync settings across all players in room via Socket
  useEffect(() => {
    const handleSettingsUpdated = ({ settings }) => {
      if (settings) {
        if (settings.questionCount !== undefined) setQuestionCount(settings.questionCount);
        if (settings.timeLimit !== undefined) setTimeLimit(settings.timeLimit);
        if (settings.shuffle !== undefined) setShuffleQuestions(settings.shuffle);
        if (settings.mode !== undefined) setGameMode(settings.mode);
      }
    };

    const handleLiveReaction = (reaction) => {
      soundManager.playReaction();
      setFloatingReactions(prev => [...prev.slice(-15), reaction]);
      setTimeout(() => {
        setFloatingReactions(prev => prev.filter(r => r.id !== reaction.id));
      }, 2500);
    };

    socket.on('room_settings_updated', handleSettingsUpdated);
    socket.on('live_reaction', handleLiveReaction);

    return () => {
      socket.off('room_settings_updated', handleSettingsUpdated);
      socket.off('live_reaction', handleLiveReaction);
    };
  }, []);

  const handleCopyPin = () => {
    soundManager.playClick();
    navigator.clipboard?.writeText(roomPin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpdateSetting = (newSettings) => {
    soundManager.playClick();
    if (newSettings.questionCount !== undefined) setQuestionCount(newSettings.questionCount);
    if (newSettings.timeLimit !== undefined) setTimeLimit(newSettings.timeLimit);
    if (newSettings.shuffle !== undefined) setShuffleQuestions(newSettings.shuffle);
    if (newSettings.gameMode !== undefined) setGameMode(newSettings.gameMode);

    if (isHost && roomPin) {
      socket.emit('update_room_settings', {
        pin: roomPin,
        settings: {
          questionCount: newSettings.questionCount ?? questionCount,
          timeLimit: newSettings.timeLimit ?? timeLimit,
          shuffle: newSettings.shuffle ?? shuffleQuestions,
          mode: newSettings.gameMode ?? gameMode
        }
      });
    }
  };

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

  const handleStartGameClick = () => {
    soundManager.playStartGame();
    // Prepare customized questions based on host settings
    const preparedQuestions = prepareQuizQuestions(quiz, questionCount, shuffleQuestions, timeLimit);
    onStartGame(preparedQuestions, { questionCount, timeLimit, shuffleQuestions, gameMode });
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
      alignItems: 'start',
      position: 'relative'
    }}>
      {/* Floating Reaction Emojis Layer */}
      <div style={{
        position: 'fixed',
        bottom: '80px',
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
              background: 'rgba(18, 24, 38, 0.92)',
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

      {/* LEFT: LOBBY, SETTINGS & PLAYERS */}
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
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                Tanlangan: <strong style={{ color: '#38bdf8' }}>{questionCount === 'all' ? 'Barchasi' : `${questionCount} ta savol`}</strong> • {timeLimit}s • {gameMode === 'race' ? 'Yo\'lda Poyga' : 'Klassik'}
              </div>
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
                onClick={handleStartGameClick}
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
          padding: '24px 20px',
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
              fontSize: 'clamp(36px, 6vw, 54px)',
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

        {/* ⚙️ HOST CONTROLS & ROOM SETTINGS (Savollar soni, Vaqt, Ovoz Test) */}
        <div style={{
          background: '#121826',
          border: '1px solid #1e283d',
          borderRadius: '18px',
          padding: '20px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            paddingBottom: '10px',
            borderBottom: '1px solid #1e283d',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Settings2 size={18} color="#818cf8" />
              <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#ffffff' }}>
                Xona Sozlamalari {isHost ? '(Host Boshqaruvi)' : '(Jonli Ko\'rinish)'}
              </h3>
            </div>
            {!isHost && (
              <span style={{ fontSize: '11px', color: '#94a3b8', background: '#182234', padding: '3px 8px', borderRadius: '6px' }}>
                Host tomonidan boshqariladi
              </span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {/* 1. Savollar Soni (5, 10, 15, 20, 30, 40, 50, Barchasi) */}
            <div style={{ background: '#0e1422', padding: '14px', borderRadius: '12px', border: '1px solid #1e283d' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '800', color: '#f8fafc', marginBottom: '10px' }}>
                <HelpCircle size={15} color="#38bdf8" />
                <span>Nechta savol o'ynalsin?</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {QUESTION_COUNTS.map((cnt) => {
                  const isSelected = questionCount === cnt;
                  return (
                    <button
                      key={cnt}
                      disabled={!isHost}
                      onClick={() => handleUpdateSetting({ questionCount: cnt })}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '800',
                        color: isSelected ? '#ffffff' : '#94a3b8',
                        background: isSelected ? '#4f46e5' : '#182234',
                        border: isSelected ? '1px solid #818cf8' : '1px solid #222d42',
                        cursor: isHost ? 'pointer' : 'default',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {cnt === 'all' ? 'Barchasi' : `${cnt} ta`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Har bir savol vaqti (10s, 15s, 20s, 30s) */}
            <div style={{ background: '#0e1422', padding: '14px', borderRadius: '12px', border: '1px solid #1e283d' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '800', color: '#f8fafc', marginBottom: '10px' }}>
                <Clock size={15} color="#f59e0b" />
                <span>Savol vaqti (soniya)</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {TIME_LIMITS.map((sec) => {
                  const isSelected = timeLimit === sec;
                  return (
                    <button
                      key={sec}
                      disabled={!isHost}
                      onClick={() => handleUpdateSetting({ timeLimit: sec })}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '800',
                        color: isSelected ? '#ffffff' : '#94a3b8',
                        background: isSelected ? '#d97706' : '#182234',
                        border: isSelected ? '1px solid #f59e0b' : '1px solid #222d42',
                        cursor: isHost ? 'pointer' : 'default',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {sec} soniya
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Savollarni Aralashtirish (Shuffle) & O'yin Rejimi */}
            <div style={{ background: '#0e1422', padding: '14px', borderRadius: '12px', border: '1px solid #1e283d' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '800', color: '#f8fafc', marginBottom: '10px' }}>
                <Shuffle size={15} color="#10b981" />
                <span>Tartib & Format</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  disabled={!isHost}
                  onClick={() => handleUpdateSetting({ shuffle: !shuffleQuestions })}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: shuffleQuestions ? '#ffffff' : '#94a3b8',
                    background: shuffleQuestions ? '#059669' : '#182234',
                    border: shuffleQuestions ? '1px solid #10b981' : '1px solid #222d42',
                    cursor: isHost ? 'pointer' : 'default'
                  }}
                >
                  {shuffleQuestions ? '🔀 Tasodifiy (Shuffle: Yoqilgan)' : '📋 Asl tartib'}
                </button>

                <button
                  disabled={!isHost}
                  onClick={() => handleUpdateSetting({ gameMode: gameMode === 'race' ? 'classic' : 'race' })}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#ffffff',
                    background: '#182234',
                    border: '1px solid #222d42',
                    cursor: isHost ? 'pointer' : 'default'
                  }}
                >
                  {gameMode === 'race' ? '🏁 Yo\'lda Poyga' : '🏆 Klassik Kahoot'}
                </button>
              </div>
            </div>

            {/* 4. 🔊 Ovoz Effektlarini Sinab Ko'rish (Sound Test) */}
            <div style={{ background: '#0e1422', padding: '14px', borderRadius: '12px', border: '1px solid #1e283d' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '800', color: '#f8fafc', marginBottom: '10px' }}>
                <Volume2 size={15} color="#ec4899" />
                <span>Ovoz Effektlarini Tekshirish</span>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => soundManager.playCorrect()}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: '800',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid #10b981',
                    color: '#34d399'
                  }}
                  title="To'g'ri javob ovozini eshitish"
                >
                  🔊 To'g'ri (Chime)
                </button>
                <button
                  onClick={() => soundManager.playWrong()}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: '800',
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid #ef4444',
                    color: '#f87171'
                  }}
                  title="Xato javob ovozini eshitish (Tu-tut-tuuuut)"
                >
                  ❌ Xato (Tu-tut-tuut!)
                </button>
                <button
                  onClick={() => soundManager.playStreak()}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: '800',
                    background: 'rgba(245, 158, 11, 0.15)',
                    border: '1px solid #f59e0b',
                    color: '#fbbf24'
                  }}
                  title="Combo ovozini eshitish"
                >
                  🔥 Combo Streak
                </button>
              </div>
            </div>
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

            {/* Quick Live Emoji Reactions Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#121826', padding: '4px 10px', borderRadius: '12px', border: '1px solid #1e283d' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', marginRight: '4px' }}>Reaksiya:</span>
              {FLOATING_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleSendReaction(emoji)}
                  style={{
                    fontSize: '16px',
                    background: 'transparent',
                    padding: '3px',
                    borderRadius: '6px',
                    transition: 'transform 0.12s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.3)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {emoji}
                </button>
              ))}
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

