import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import JoinModal from './components/JoinModal';
import AuthModal from './components/AuthModal';
import HomeView from './views/HomeView';
import ExploreView from './views/ExploreView';
import ShopView from './views/ShopView';
import CreateQuizView from './views/CreateQuizView';
import LobbyView from './views/LobbyView';
import GamePlayView from './views/GamePlayView';
import PodiumView from './views/PodiumView';
import LeaderboardView from './views/LeaderboardView';
import ProfileView from './views/ProfileView';

import { DEFAULT_QUIZZES } from './data/defaultQuizzes';
import { soundManager } from './utils/sounds';
import { socket } from './utils/socket';
import { translations } from './utils/translations';

export default function App() {
  // 1. User state with inventory & equipped effects
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('kahotbek_user');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          inventory: parsed.inventory || ['trail_fire'],
          equippedTrail: parsed.equippedTrail || 'trail_fire',
          coins: parsed.coins ?? 450
        };
      } catch {}
    }
    return {
      id: 'usr-default',
      name: 'Kahot Master',
      username: '@kahot_master',
      avatar: '🦁',
      coins: 450,
      xp: 2850,
      level: 5,
      wins: 14,
      isVerified: false,
      inventory: ['trail_fire'],
      equippedTrail: 'trail_fire'
    };
  });

  // 2. Custom Quizzes state
  const [customQuizzes, setCustomQuizzes] = useState(() => {
    const saved = localStorage.getItem('kahotbek_custom_quizzes');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('kahotbek_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('kahotbek_custom_quizzes', JSON.stringify(customQuizzes));
  }, [customQuizzes]);

  const allQuizzes = [...customQuizzes, ...DEFAULT_QUIZZES];

  // 3. Navigation & Modals & Settings (Language, Theme, Audio)
  const [currentTab, setCurrentTab] = useState('home');
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [lang, setLang] = useState(() => localStorage.getItem('kahotbek_lang') || 'uz');
  const [theme, setTheme] = useState(() => localStorage.getItem('kahotbek_theme') || 'dark');

  useEffect(() => {
    localStorage.setItem('kahotbek_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('kahotbek_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const t = translations[lang] || translations.uz;

  // 4. Active Room & Socket Session
  const [activeQuiz, setActiveQuiz] = useState(DEFAULT_QUIZZES[0]);
  const [roomPin, setRoomPin] = useState('');
  const [hostSecret, setHostSecret] = useState(null);
  const [isHost, setIsHost] = useState(true);
  const [isSpectator, setIsSpectator] = useState(false);
  const [lobbyPlayers, setLobbyPlayers] = useState([]);
  const [finalScores, setFinalScores] = useState([]);
  const [editingQuiz, setEditingQuiz] = useState(null);

  // Socket listener bindings
  useEffect(() => {
    socket.on('player_joined', ({ players }) => {
      soundManager.playClick();
      setLobbyPlayers(players);
    });

    socket.on('player_left', ({ players }) => {
      setLobbyPlayers(players);
    });

    socket.on('game_started', (data) => {
      soundManager.playStartGame();
      if (data && data.quiz) {
        setActiveQuiz(prev => ({
          ...prev,
          ...data.quiz
        }));
      }
      setCurrentTab('gameplay');
    });

    socket.on('game_finished', ({ finalScores }) => {
      setFinalScores(finalScores);
      setCurrentTab('podium');
    });

    return () => {
      socket.off('player_joined');
      socket.off('player_left');
      socket.off('game_started');
      socket.off('game_finished');
    };
  }, []);

  // 1. Host creates a live real-time room
  const handleHostLobby = (quiz) => {
    setActiveQuiz(quiz);
    setIsHost(true);
    setIsSpectator(false);
    const newPin = Math.floor(100000 + Math.random() * 900000).toString();
    setRoomPin(newPin);

    socket.emit('create_room', {
      pin: newPin,
      quiz,
      hostName: user.name,
      hostAvatar: user.avatar,
      mode: 'race'
    }, (res) => {
      if (res && res.success) {
        setHostSecret(res.hostSecret);
        setLobbyPlayers(res.players);
      }
    });

    setLobbyPlayers([
      { id: socket.id || 'host', name: user.name, avatar: user.avatar, isHost: true, score: 0, step: 0, trailEffect: user.equippedTrail }
    ]);
    setCurrentTab('lobby');
  };

  // 2. Real player joins room via PIN
  const handleJoinGameFromPin = ({ pin, nickname, avatar }) => {
    socket.emit('join_room', {
      pin,
      name: nickname,
      avatar,
      trailEffect: user.equippedTrail || 'trail_fire'
    }, (res) => {
      if (res && res.success) {
        setRoomPin(pin);
        setIsHost(false);
        setIsSpectator(!!res.isSpectator);
        setLobbyPlayers(res.players || []);
        setIsJoinModalOpen(false);
        
        if (res.isSpectator || res.phase === 'question' || res.phase === 'intro') {
          setCurrentTab('gameplay');
        } else {
          setCurrentTab('lobby');
        }
      } else {
        alert(res?.message || "Xonaga ulanib bo'lmadi!");
      }
    });
  };

  // 3. Solo Practice
  const handlePlaySolo = (quiz) => {
    setActiveQuiz(quiz);
    setIsHost(true);
    setIsSpectator(false);
    setLobbyPlayers([
      { id: user.id, name: user.name, avatar: user.avatar, isHost: true, score: 0, step: 0, trailEffect: user.equippedTrail }
    ]);
    setCurrentTab('gameplay');
  };

  // 4. Host starts game with customized questions (5, 10, 15, 20, 30, 40, 50, all)
  const handleStartGameFromLobby = (customizedQuestions, settings) => {
    if (customizedQuestions && Array.isArray(customizedQuestions)) {
      setActiveQuiz(prev => ({
        ...prev,
        questions: customizedQuestions
      }));
    }

    if (hostSecret) {
      socket.emit('host_start_game', { 
        pin: roomPin, 
        hostSecret,
        customizedQuestions 
      });
    }
    setCurrentTab('gameplay');
  };

  // 5. Finish Game
  const handleFinishGame = (scores) => {
    setFinalScores(scores);
    const isWinner = scores[0]?.name === user.name;
    const gainedXp = isWinner ? 1000 : 400;
    const gainedCoins = isWinner ? 60 : 25;

    setUser(prev => ({
      ...prev,
      xp: prev.xp + gainedXp,
      coins: prev.coins + gainedCoins,
      wins: isWinner ? (prev.wins || 0) + 1 : (prev.wins || 0),
      level: Math.floor((prev.xp + gainedXp) / 1000) + 1
    }));

    setCurrentTab('podium');
  };

  // Quiz Authoring Actions
  const handleSaveQuiz = (newQuiz) => {
    const existingIdx = customQuizzes.findIndex(q => q.id === newQuiz.id);
    if (existingIdx >= 0) {
      const updated = [...customQuizzes];
      updated[existingIdx] = newQuiz;
      setCustomQuizzes(updated);
    } else {
      setCustomQuizzes([newQuiz, ...customQuizzes]);
    }
  };

  const handleSaveAndPlay = (newQuiz) => {
    handleSaveQuiz(newQuiz);
    handlePlaySolo(newQuiz);
  };

  const handleEditQuiz = (quiz) => {
    setEditingQuiz(quiz);
    setCurrentTab('create');
  };

  const handleDeleteQuiz = (id) => {
    if (window.confirm("Haqiqatan ham ushbu quizni o'chirmoqchimisiz?")) {
      soundManager.playClick();
      setCustomQuizzes(prev => prev.filter(q => q.id !== id));
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-main)',
      color: 'var(--text-main)',
      transition: 'background-color 0.2s ease, color 0.2s ease'
    }}>
      {/* Top Navbar */}
      {currentTab !== 'gameplay' && (
        <Navbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          user={user}
          onOpenJoinModal={() => setIsJoinModalOpen(true)}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
          lang={lang}
          setLang={setLang}
          theme={theme}
          setTheme={setTheme}
        />
      )}

      {/* Main Content */}
      <main style={{ flex: 1 }}>
        {currentTab === 'home' && (
          <HomeView
            quizzes={allQuizzes}
            user={user}
            lang={lang}
            theme={theme}
            onPlaySolo={handlePlaySolo}
            onHostLobby={handleHostLobby}
            onOpenJoinModal={() => setIsJoinModalOpen(true)}
            onGoToCreate={() => {
              setEditingQuiz(null);
              setCurrentTab('create');
            }}
            onGoToExplore={() => setCurrentTab('explore')}
            onGoToLeaderboard={() => setCurrentTab('leaderboard')}
          />
        )}

        {currentTab === 'explore' && (
          <ExploreView
            quizzes={allQuizzes}
            lang={lang}
            theme={theme}
            onPlaySolo={handlePlaySolo}
            onHostLobby={handleHostLobby}
          />
        )}

        {currentTab === 'shop' && (
          <ShopView
            user={user}
            lang={lang}
            theme={theme}
            onUpdateUser={setUser}
          />
        )}

        {currentTab === 'create' && (
          <CreateQuizView
            initialQuiz={editingQuiz}
            lang={lang}
            theme={theme}
            onSaveQuiz={handleSaveQuiz}
            onSaveAndPlay={handleSaveAndPlay}
          />
        )}

        {currentTab === 'lobby' && (
          <LobbyView
            quiz={activeQuiz}
            roomPin={roomPin}
            players={lobbyPlayers}
            isHost={isHost}
            user={user}
            lang={lang}
            theme={theme}
            onStartGame={handleStartGameFromLobby}
            onLeaveLobby={() => setCurrentTab('home')}
            onRemovePlayer={(id) => setLobbyPlayers(prev => prev.filter(p => p.id !== id))}
          />
        )}

        {currentTab === 'gameplay' && (
          <GamePlayView
            quiz={activeQuiz}
            players={lobbyPlayers}
            user={user}
            lang={lang}
            theme={theme}
            roomPin={roomPin}
            isSpectator={isSpectator}
            onFinishGame={handleFinishGame}
          />
        )}

        {currentTab === 'podium' && (
          <PodiumView
            quiz={activeQuiz}
            finalScores={finalScores}
            user={user}
            lang={lang}
            theme={theme}
            onPlayAgain={() => handlePlaySolo(activeQuiz)}
            onGoHome={() => setCurrentTab('home')}
            onGoExplore={() => setCurrentTab('explore')}
          />
        )}

        {currentTab === 'leaderboard' && (
          <LeaderboardView user={user} lang={lang} theme={theme} />
        )}

        {currentTab === 'profile' && (
          <ProfileView
            user={user}
            myQuizzes={customQuizzes}
            lang={lang}
            theme={theme}
            onPlaySolo={handlePlaySolo}
            onHostLobby={handleHostLobby}
            onEditQuiz={handleEditQuiz}
            onDeleteQuiz={handleDeleteQuiz}
            onGoToCreate={() => {
              setEditingQuiz(null);
              setCurrentTab('create');
            }}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      {currentTab !== 'gameplay' && (
        <footer style={{
          borderTop: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface)',
          padding: '20px',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '13px',
          transition: 'background-color 0.2s ease, border-color 0.2s ease'
        }}>
          <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img src="/logo.png" alt="Kahotbek" style={{ width: '22px', height: '22px', objectFit: 'contain', borderRadius: '4px' }} />
              <span style={{ fontWeight: '800', color: 'var(--text-main)' }}>KAHOTBEK</span>
              <span>{t.footerCopyright}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: '#10b981', fontWeight: '700' }}>{t.footerSecured}</span>
              <span>•</span>
              <a href="https://t.me/kahotbekbot" target="_blank" rel="noreferrer" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: '700' }}>
                @kahotbekbot
              </a>
            </div>
          </div>
        </footer>
      )}

      {/* Modals */}
      <JoinModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onJoinGame={handleJoinGameFromPin}
        lang={lang}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        user={user}
        onUpdateUser={setUser}
        lang={lang}
      />
    </div>
  );
}

