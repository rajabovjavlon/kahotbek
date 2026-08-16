import React from 'react';
import { 
  Gamepad2, 
  PlusCircle, 
  Trophy, 
  User, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  KeyRound,
  ShoppingBag
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
    { id: 'shop', label: "Do'kon", icon: ShoppingBag, badge: 'Yangi' },
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
      background: '#0e1422',
      borderBottom: '1px solid #1f2a3e',
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
          <img
            src="/logo.png"
            alt="Kahotbek"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              objectFit: 'contain'
            }}
          />
          <div>
            <div style={{
              fontSize: '20px',
              fontWeight: '900',
              fontFamily: 'var(--font-heading)',
              letterSpacing: '-0.02em',
              color: '#ffffff',
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
                background: '#1e293b',
                color: '#818cf8',
                border: '1px solid #334155'
              }}>PRO</span>
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '-2px' }}>
              Interaktiv Viktorinalar Maydoni
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: '#0b0f19',
          padding: '4px',
          borderRadius: '12px',
          border: '1px solid #1c2638'
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
                  gap: '7px',
                  padding: '7px 13px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: isActive ? '700' : '600',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  background: isActive ? '#4f46e5' : 'transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={15} color={isActive ? '#ffffff' : (item.highlight ? '#818cf8' : '#94a3b8')} />
                <span>{item.label}</span>
                {item.badge && (
                  <span style={{
                    fontSize: '9px',
                    fontWeight: '800',
                    background: '#f59e0b',
                    color: '#000',
                    padding: '1px 5px',
                    borderRadius: '4px'
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions: PIN Quick Join, Sound, User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Quick PIN Join Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenJoinModal();
            }}
            className="btn-solid-blue"
            style={{
              padding: '7px 14px',
              fontSize: '13px',
              borderRadius: '10px'
            }}
          >
            <KeyRound size={15} />
            <span>PIN bilan kirish</span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={handleToggleSound}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#141d2e',
              border: '1px solid #24324c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isMuted ? '#ef4444' : '#38bdf8'
            }}
            title={isMuted ? "Ovozni yoqish" : "Ovozni o'chirish"}
          >
            {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
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
              gap: '8px',
              background: '#141d2e',
              border: '1px solid #24324c',
              padding: '5px 12px 5px 6px',
              borderRadius: '10px',
              cursor: 'pointer'
            }}
          >
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: '#1e293b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px'
            }}>
              {currentUser.avatar || '⚡'}
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#f8fafc', lineHeight: 1.2 }}>
                {currentUser.name}
              </div>
              <div style={{ fontSize: '11px', color: '#fbbf24', fontWeight: '700' }}>
                🪙 {currentUser.coins ?? 450} Tanga
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
