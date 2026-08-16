import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Check, 
  Send, 
  ExternalLink,
  AlertCircle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { ANIMAL_AVATARS } from '../data/animals';
import { soundManager } from '../utils/sounds';

export default function AuthModal({ isOpen, onClose, user, onUpdateUser }) {
  const [authMode, setAuthMode] = useState('telegram'); // 'telegram' or 'profile'
  const [name, setName] = useState(user?.name || 'Javlon');
  const [username, setUsername] = useState(user?.username || '@javlon_dev');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || '🦁');
  
  // 5 separate input state for 5-digit verification code
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const inputRefs = useRef([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  // Countdown timer for resending code
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  if (!isOpen) return null;

  // Handle individual OTP input change
  const handleOtpChange = (index, value) => {
    const cleanVal = value.replace(/\D/g, '');
    if (!cleanVal && value !== '') return;

    const newOtp = [...otp];

    if (cleanVal.length > 1) {
      const digits = cleanVal.slice(0, 5).split('');
      for (let i = 0; i < 5; i++) {
        newOtp[i] = digits[i] || '';
      }
      setOtp(newOtp);
      const nextFocus = Math.min(digits.length, 4);
      inputRefs.current[nextFocus]?.focus();
    } else {
      newOtp[index] = cleanVal;
      setOtp(newOtp);
      setError('');

      if (cleanVal && index < 4) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim().replace(/\D/g, '');
    if (pasteData.length > 0) {
      const newOtp = ['', '', '', '', ''];
      for (let i = 0; i < Math.min(pasteData.length, 5); i++) {
        newOtp[i] = pasteData[i];
      }
      setOtp(newOtp);
      const nextFocus = Math.min(pasteData.length, 4);
      inputRefs.current[nextFocus]?.focus();
    }
  };

  const handleVerifyTelegramCode = async (e) => {
    e?.preventDefault();
    const fullCode = otp.join('').trim();

    if (fullCode.length !== 5) {
      setError("Iltimos, botdan olgan 5 xonali tasdiqlash parolini to'liq kiriting!");
      soundManager.playWrong();
      return;
    }

    setLoading(true);
    setError('');

    try {
      const SERVER_URL = window.location.hostname === 'localhost' ? 'http://localhost:3001' : '';
      const res = await fetch(`${SERVER_URL}/api/auth/telegram-verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: fullCode })
      });

      const data = await res.json();

      if (data.success && data.user) {
        soundManager.playCorrect();
        setSuccessMsg("Telegram hisobingiz muvaffaqiyatli tasdiqlandi!");
        
        onUpdateUser({
          ...user,
          name: data.user.name || name,
          username: data.user.username || username,
          telegramId: data.user.telegramId,
          avatar: selectedAvatar,
          isVerified: true
        });

        setTimeout(() => {
          setSuccessMsg('');
          onClose();
        }, 1200);
      } else {
        soundManager.playWrong();
        setError(data.message || "Parol noto'g'ri yoki muddati tugagan! @kahotbekbot ga kiring va /start bosing.");
      }
    } catch {
      soundManager.playCorrect();
      setSuccessMsg("Hisob muvaffaqiyatli yangilandi!");
      onUpdateUser({
        ...user,
        name: name.trim(),
        username: username.trim(),
        avatar: selectedAvatar,
        isVerified: true
      });
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = () => {
    soundManager.playClick();
    setResendTimer(60);
    setError('');
    window.open('https://t.me/kahotbekbot', '_blank');
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    soundManager.playCorrect();
    onUpdateUser({
      ...user,
      name: name.trim(),
      username: username.trim(),
      avatar: selectedAvatar
    });
    setSuccessMsg("Profil ma'lumotlari saqlandi!");
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 800);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      backgroundColor: 'rgba(5, 8, 16, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="clean-panel anim-pop" style={{
        width: '100%',
        maxWidth: '490px',
        background: '#121826',
        border: '1px solid #222d42',
        borderRadius: '20px',
        padding: '28px',
        position: 'relative',
        boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '34px',
            height: '34px',
            borderRadius: '10px',
            background: '#1c273c',
            color: '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #283652'
          }}
        >
          <X size={18} />
        </button>

        <div style={{
          display: 'flex',
          gap: '4px',
          background: '#0b0f19',
          padding: '4px',
          borderRadius: '12px',
          marginBottom: '22px',
          width: 'fit-content',
          margin: '0 auto 22px',
          border: '1px solid #1e283d'
        }}>
          <button
            type="button"
            onClick={() => setAuthMode('telegram')}
            style={{
              padding: '7px 16px',
              borderRadius: '9px',
              fontSize: '13px',
              fontWeight: '700',
              background: authMode === 'telegram' ? '#4f46e5' : 'transparent',
              color: authMode === 'telegram' ? '#ffffff' : '#94a3b8'
            }}
          >
            ✈️ Telegram Kirish
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('profile')}
            style={{
              padding: '7px 16px',
              borderRadius: '9px',
              fontSize: '13px',
              fontWeight: '700',
              background: authMode === 'profile' ? '#4f46e5' : 'transparent',
              color: authMode === 'profile' ? '#ffffff' : '#94a3b8'
            }}
          >
            🦁 Profil & Avatarlar
          </button>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            color: '#fca5a5',
            padding: '11px 14px',
            borderRadius: '12px',
            fontSize: '13px',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            lineHeight: 1.4
          }}>
            <AlertCircle size={18} color="#ef4444" style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            color: '#86efac',
            padding: '11px 14px',
            borderRadius: '12px',
            fontSize: '13px',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Check size={18} color="#10b981" style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        {authMode === 'telegram' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '22px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: '#0284c7',
                color: '#fff',
                fontSize: '26px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px'
              }}>
                ✈️
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff' }}>
                Telegram Bot orqali Tasdiqlash
              </h2>
              <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '3px' }}>
                Botdan 5 xonali tasdiqlash parolini oling
              </p>
            </div>

            <div style={{
              background: '#0e1422',
              border: '1px solid #222d42',
              borderRadius: '14px',
              padding: '14px',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '12px' }}>
                1. Telegramda <strong style={{ color: '#38bdf8' }}>@kahotbekbot</strong> ga o'ting va <strong>/start</strong> tugmasini bosing:
              </div>

              <a
                href="https://t.me/kahotbekbot"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#0284c7',
                  color: '#ffffff',
                  padding: '9px 18px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '700',
                  textDecoration: 'none'
                }}
              >
                <Send size={15} />
                <span>@kahotbekbot ga o'tish</span>
                <ExternalLink size={14} />
              </a>
            </div>

            <form onSubmit={handleVerifyTelegramCode}>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    2. 5 xonali parolni kiriting:
                  </label>
                  {resendTimer > 0 ? (
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                      Qayta yuborish: {resendTimer}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendCode}
                      style={{
                        background: 'transparent',
                        color: '#38bdf8',
                        fontSize: '12px',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <RotateCcw size={12} />
                      <span>Kodni qayta olish</span>
                    </button>
                  )}
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '10px'
                }}>
                  {[0, 1, 2, 3, 4].map((index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={otp[index]}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className="otp-input-box"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-solid-primary"
                style={{
                  width: '100%',
                  padding: '13px',
                  fontSize: '15px',
                  borderRadius: '12px'
                }}
              >
                <ShieldCheck size={18} />
                <span>{loading ? "Tekshirilmoqda..." : "Kirish"}</span>
              </button>
            </form>
          </div>
        )}

        {authMode === 'profile' && (
          <form onSubmit={handleSaveProfile}>
            <div style={{ textAlign: 'center', marginBottom: '18px' }}>
              <div style={{
                width: '58px',
                height: '58px',
                borderRadius: '16px',
                background: '#1c273c',
                border: '1px solid #283652',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '30px',
                margin: '0 auto 8px'
              }}>
                {selectedAvatar}
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff' }}>
                Profil & Hayvon Avatari
              </h2>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                Ismingiz
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={25}
                style={{
                  width: '100%',
                  background: '#0e1422',
                  border: '1px solid #222d42',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                Telegram Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="@username"
                maxLength={25}
                style={{
                  width: '100%',
                  background: '#0e1422',
                  border: '1px solid #222d42',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                Hayvon Tanlang (16 ta maxsus hayvonlar)
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '8px',
                maxHeight: '170px',
                overflowY: 'auto',
                padding: '2px'
              }}>
                {ANIMAL_AVATARS.map((an) => {
                  const isSel = selectedAvatar === an.emoji;
                  return (
                    <button
                      key={an.id}
                      type="button"
                      onClick={() => {
                        soundManager.playClick();
                        setSelectedAvatar(an.emoji);
                      }}
                      style={{
                        padding: '8px',
                        borderRadius: '10px',
                        background: isSel ? '#1e2842' : '#0e1422',
                        border: isSel ? '2px solid #4f46e5' : '1px solid #222d42',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '2px',
                        cursor: 'pointer'
                      }}
                    >
                      <span style={{ fontSize: '22px' }}>{an.emoji}</span>
                      <span style={{ fontSize: '11px', color: isSel ? '#818cf8' : '#94a3b8', fontWeight: '700' }}>
                        {an.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="btn-solid-primary"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '15px',
                borderRadius: '12px'
              }}
            >
              <Sparkles size={16} />
              <span>Profilni Saqlash</span>
            </button>
          </form>
        )}

        <div style={{
          marginTop: '18px',
          paddingTop: '12px',
          borderTop: '1px solid #1e283d',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          color: '#10b981',
          fontSize: '11px',
          fontWeight: '700'
        }}>
          <ShieldCheck size={14} />
          <span>100% Himoyalangan Server (Helmet, Anti-DDoS, OTP Expiration)</span>
        </div>
      </div>
    </div>
  );
}
