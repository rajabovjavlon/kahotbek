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
  ShoppingBag,
  Sun,
  Moon,
  Globe
} from 'lucide-react';
import { soundManager } from '../utils/sounds';
import { translations } from '../utils/translations';

export default function Navbar({ 
  currentTab = 'home', 
  setCurrentTab = () => {}, 
  user = { name: 'Kahot Master', avatar: '⚡', coins: 450, xp: 2850 }, 
  onOpenJoinModal = () => {}, 
  onOpenAuthModal = () => {},
  isMuted = false,
  setIsMuted = () => {},
  lang = 'uz',
  setLang = () => {},
  theme = 'dark',
  setTheme = () => {}
}) {
  const t = translations[lang] || translations.uz;

  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundManager.playClick();
    }
  };

  const handleToggleTheme = () => {
    soundManager.playClick();
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const handleToggleLang = () => {
    soundManager.playClick();
    const nextLang = lang === 'uz' ? 'ru' : 'uz';
    setLang(nextLang);
  };

  const navItems = [
    { id: 'home', label: t.navHome, icon: Sparkles },
    { id: 'explore', label: t.navExplore, icon: Gamepad2 },
    { id: 'shop', label: t.navShop, icon: ShoppingBag, badge: t.navShopNew },
    { id: 'create', label: t.navCreate, icon: PlusCircle, highlight: true },
    { id: 'leaderboard', label: t.navLeaderboard, icon: Trophy },
    { id: 'profile', label: t.navProfile, icon: User },
  ];

  const currentUser = user || { name: 'Kahot Master', avatar: '⚡', coins: 450, xp: 2850 };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '12px 20px',
      transition: 'background-color 0.2s ease, border-color 0.2s ease'
    }}>
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
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
              color: 'var(--text-main)',
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
                background: 'rgba(79, 70, 229, 0.15)',
                color: '#818cf8',
                border: '1px solid rgba(79, 70, 229, 0.3)'
              }}>{t.proBadge}</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '-2px' }}>
              {t.tagline}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: 'var(--bg-main)',
          padding: '4px',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)'
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
                  fontWeight: isActive ? '800' : '600',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  background: isActive ? 'var(--brand-primary)' : 'transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={15} color={isActive ? '#ffffff' : (item.highlight ? '#818cf8' : 'var(--text-muted)')} />
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

        {/* Right Actions: PIN Quick Join, Lang, Theme, Sound, User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Quick PIN Join Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenJoinModal();
            }}
            className="btn-solid-blue"
            style={{
              padding: '7px 13px',
              fontSize: '13px',
              borderRadius: '10px'
            }}
          >
            <KeyRound size={15} />
            <span>{t.pinJoin}</span>
          </button>

          {/* Language Switcher Button (UZB / RUS) */}
          <button
            onClick={handleToggleLang}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 10px',
              borderRadius: '10px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-main)',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer'
            }}
            title="Tilni o'zgartirish / Сменить язык"
          >
            <Globe size={14} color="#818cf8" />
            <span>{lang === 'uz' ? '🇺🇿 UZB' : '🇷🇺 RUS'}</span>
          </button>

          {/* Dark / Light Theme Toggle */}
          <button
            onClick={handleToggleTheme}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme === 'dark' ? '#fbbf24' : '#4f46e5'
            }}
            title={theme === 'dark' ? t.themeLight : t.themeDark}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={handleToggleSound}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isMuted ? '#ef4444' : '#38bdf8'
            }}
            title={isMuted ? t.soundOn : t.soundOff}
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
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              padding: '5px 12px 5px 6px',
              borderRadius: '10px',
              cursor: 'pointer'
            }}
          >
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: 'rgba(79, 70, 229, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px'
            }}>
              {currentUser.avatar || '⚡'}
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)', lineHeight: 1.2 }}>
                {currentUser.name}
              </div>
              <div style={{ fontSize: '11px', color: '#fbbf24', fontWeight: '700' }}>
                🪙 {currentUser.coins ?? 450} {t.coinsLabel}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

