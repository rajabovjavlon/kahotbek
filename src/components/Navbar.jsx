import React from 'react';
import { 
  Zap, 
  Gamepad2, 
  PlusCircle, 
  LogIn, 
  Trophy, 
  User, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  KeyRound, 
  Layers 
} from 'lucide-react';
import { soundManager } from '../utils/sounds';

export default function Navbar({ 
  currentTab = 'home', 
  setCurrentTab = () => {}, 
  user = { name: 'Kahot Master', avatar: '⚡', coins: 450, xp: 2850 }, 
  onOpenJoinModal = () => {}, 
  onOpenAuthModal = () => {},
  isMuted = false,
  setIsMuted = () => {}
}) {
  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundManager.playClick();
    }
  };

  const navItems = [
    { id: 'home', label: 'Bosh sahifa', icon: Sparkles },
    { id: 'explore', label: "O'yinlar", icon: Gamepad2 },
    { id: 'create', label: 'Quiz Yaratish', icon: PlusCircle, highlight: true },
    { id: 'leaderboard', label: 'Reyting', icon: Trophy },
    { id: 'profile', label: 'Mening Profilim', icon: User },
  ];

  const currentUser = user || { name: 'Kahot Master', avatar: '⚡', coins: 450, xp: 2850 };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(9, 12, 21, 0.92)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '12px 24px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        {/* Logo */}
        <div 
          onClick={() => {
            soundManager.playClick();
            setCurrentTab('home');
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.6)',
            fontSize: '22px'
          }}>
            ⚡
          </div>
          <div>
            <div style={{
              fontSize: '22px',
              fontWeight: '900',
              fontFamily: 'var(--font-heading)',
              letterSpacing: '-0.03em',
              background: 'linear-gradient(90deg, #ffffff, #a5b4fc, #38bdf8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              KAHOTBEK
              <span style={{
                fontSize: '10px',
                fontWeight: '800',
                padding: '2px 6px',
                borderRadius: '6px',
                background: 'rgba(139, 92, 246, 0.3)',
                color: '#c084fc',
                border: '1px solid rgba(168, 85, 247, 0.4)',
                WebkitTextFillColor: 'initial'
              }}>PRO</span>
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '-2px' }}>
              Interaktiv Quiz & Game Arena
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(17, 22, 37, 0.8)',
          padding: '6px',
          borderRadius: '14px',
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  soundManager.playClick();
                  setCurrentTab(item.id);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: isActive ? '700' : '600',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  background: isActive 
                    ? (item.highlight 
                        ? 'linear-gradient(135deg, #8b5cf6, #6366f1)' 
                        : 'rgba(255, 255, 255, 0.12)')
                    : 'transparent',
                  boxShadow: isActive ? '0 4px 15px rgba(0, 0, 0, 0.3)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={16} color={isActive ? '#ffffff' : (item.highlight ? '#a855f7' : '#94a3b8')} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions: PIN Quick Join, Sound, User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Quick PIN Join Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenJoinModal();
            }}
            className="btn-neon-cyan"
            style={{
              padding: '8px 16px',
              fontSize: '13px',
              borderRadius: '12px'
            }}
          >
            <KeyRound size={16} />
            <span>PIN bilan kirish</span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={handleToggleSound}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isMuted ? '#ef4444' : '#38bdf8'
            }}
            title={isMuted ? "Ovozni yoqish" : "Ovozni o'chirish"}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          {/* User Status / Profile Button */}
          <div 
            onClick={() => {
              soundManager.playClick();
              onOpenAuthModal();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '6px 12px 6px 8px',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'border-color 0.2s ease'
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #a855f7, #ec4899)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}>
              {currentUser.avatar || '⚡'}
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#f8fafc', lineHeight: 1.2 }}>
                {currentUser.name}
              </div>
              <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '600' }}>
                🪙 {currentUser.coins ?? 450} • {currentUser.xp ?? 2850} XP
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
