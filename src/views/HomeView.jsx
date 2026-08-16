import React, { useState } from 'react';
import { 
  Sparkles, 
  Play, 
  PlusCircle, 
  KeyRound, 
  Trophy, 
  Users, 
  Zap, 
  Award, 
  Search, 
  Gamepad2
} from 'lucide-react';
import QuizCard from '../components/QuizCard';
import { CATEGORIES, DEFAULT_QUIZZES } from '../data/defaultQuizzes';
import { soundManager } from '../utils/sounds';

export default function HomeView({
  quizzes = [],
  user = { name: 'Kahot Master', coins: 450, avatar: '🦁', xp: 0, wins: 0 },
  onPlaySolo = () => {},
  onHostLobby = () => {},
  onOpenJoinModal = () => {},
  onGoToCreate = () => {},
  onGoToExplore = () => {},
  onGoToLeaderboard = () => {}
}) {
  const [selectedCategory, setSelectedCategory] = useState('Barchasi');
  const [searchQuery, setSearchQuery] = useState('');

  const quizList = quizzes && quizzes.length > 0 ? quizzes : DEFAULT_QUIZZES;
  const currentUser = user || { name: 'Kahot Master', coins: 450, avatar: '🦁', xp: 0, wins: 0 };

  // Calculate real metrics
  const totalQuestions = quizList.reduce((acc, q) => acc + (q.questions ? q.questions.length : 0), 0);
  const totalQuizzes = quizList.length;
  const userXP = currentUser.xp || 0;
  const userWins = currentUser.wins || 0;

  // Filter quizzes
  const filteredQuizzes = quizList.filter(q => {
    if (!q) return false;
    const matchesCat = selectedCategory === 'Barchasi' || q.category === selectedCategory;
    const matchesSearch = (q.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (q.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const featuredQuiz = quizList[0] || DEFAULT_QUIZZES[0];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px 20px 60px' }}>
      {/* Hero Banner Section (Solid sleek dark container) */}
      <section style={{
        borderRadius: '20px',
        background: '#121826',
        border: '1px solid #1e283d',
        padding: '36px 32px',
        marginBottom: '32px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
          alignItems: 'center'
        }}>
          <div>
            {/* Real status indicator badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '5px 12px',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '9999px',
              color: '#34d399',
              fontSize: '12px',
              fontWeight: '700',
              marginBottom: '16px'
            }}>
              <span className="pulse-dot" />
              <span>Real-Time Jonli Xonalar Faol</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(28px, 4.5vw, 40px)',
              fontWeight: '900',
              lineHeight: 1.2,
              color: '#ffffff',
              marginBottom: '14px',
              letterSpacing: '-0.02em'
            }}>
              Interaktiv Viktorinalar & <br />
              <span style={{ color: '#818cf8' }}>
                Jonli Bilimlar Maydoni!
              </span>
            </h1>

            <p style={{
              fontSize: '15px',
              color: '#94a3b8',
              maxWidth: '600px',
              lineHeight: 1.6,
              marginBottom: '24px'
            }}>
              Do'stlaringiz bilan jonli xona oching, 6 xonali PIN kod orqali ulaning va savollarga tezkor javob berib peshqadamlar safiga ko'tariling!
            </p>

            {/* Quick Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  soundManager.playClick();
                  onOpenJoinModal();
                }}
                className="btn-solid-blue"
                style={{ fontSize: '14px', padding: '12px 24px', borderRadius: '12px' }}
              >
                <KeyRound size={18} />
                <span>PIN Bilan Ulanish</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  onGoToCreate();
                }}
                className="btn-solid-primary"
                style={{ fontSize: '14px', padding: '12px 24px', borderRadius: '12px' }}
              >
                <PlusCircle size={18} />
                <span>Quiz Yaratish</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  if (featuredQuiz) onPlaySolo(featuredQuiz);
                }}
                className="btn-solid-secondary"
                style={{ fontSize: '14px', padding: '12px 20px', borderRadius: '12px' }}
              >
                <Play size={16} fill="#fff" />
                <span>Tezkor Solo O'yin</span>
              </button>
            </div>
          </div>

          {/* Hero Right Quick PIN Box */}
          <div style={{
            padding: '24px',
            borderRadius: '16px',
            maxWidth: '340px',
            width: '100%',
            margin: '0 auto',
            background: '#182234',
            border: '1px solid #222d42'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#0284c7',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800'
              }}>
                #
              </div>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#ffffff' }}>Tezkor Kirish</h4>
                <p style={{ fontSize: '11px', color: '#94a3b8' }}>Xona PIN kodini tering</p>
              </div>
            </div>

            <div 
              onClick={onOpenJoinModal}
              style={{
                background: '#0e1422',
                border: '1px dashed #283652',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'center',
                cursor: 'pointer',
                marginBottom: '14px'
              }}
            >
              <div style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '4px', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                _ _ _  _ _ _
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>
                PIN kiritish uchun bosing
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px',
              color: '#cbd5e1',
              paddingTop: '10px',
              borderTop: '1px solid #222d42'
            }}>
              <span>{currentUser.avatar} {currentUser.name}</span>
              <span style={{ color: '#fbbf24', fontWeight: '700' }}>🪙 {currentUser.coins || 0} Tanga</span>
            </div>
          </div>
        </div>
      </section>

      {/* Real Dynamic Stats Bar */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '14px',
        marginBottom: '32px'
      }}>
        {[
          { label: "Mavjud Viktorinalar", val: `${totalQuizzes} ta`, icon: "📚", color: "#3b82f6" },
          { label: "Jami Savollar Bazasi", val: `${totalQuestions} ta`, icon: "🎯", color: "#f59e0b" },
          { label: "Sizning G'alabalaringiz", val: `${userWins} ta`, icon: "🏆", color: "#10b981" },
          { label: "To'plangan Tajriba (XP)", val: `⚡ ${userXP}`, icon: "⭐", color: "#8b5cf6" },
        ].map((st, i) => (
          <div key={i} style={{
            background: '#121826',
            border: '1px solid #1e283d',
            padding: '16px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            borderRadius: '14px'
          }}>
            <div style={{
              fontSize: '24px',
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: '#182234',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #222d42'
            }}>
              {st.icon}
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff', lineHeight: 1.2 }}>
                {st.val}
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                {st.label}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Categories & Search Filter */}
      <section style={{ marginBottom: '32px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '20px',
          flexWrap: 'wrap'
        }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Gamepad2 size={22} color="#818cf8" />
              <span>Viktorinalar & Mavzular</span>
            </h2>
            <p style={{ fontSize: '13px', color: '#94a3b8' }}>
              Turli yo'nalishlar bo'yicha sara intellektual o'yinlar
            </p>
          </div>

          {/* Search Box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: '#121826',
            border: '1px solid #1e283d',
            borderRadius: '12px',
            padding: '8px 14px',
            width: '280px'
          }}>
            <Search size={16} color="#94a3b8" />
            <input
              type="text"
              placeholder="Quiz qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                fontSize: '13px',
                width: '100%'
              }}
            />
          </div>
        </div>

        {/* Category Filter Chips */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '22px'
        }}>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedCategory(cat);
                }}
                style={{
                  padding: '7px 14px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: isSelected ? '#ffffff' : '#94a3b8',
                  background: isSelected ? '#4f46e5' : '#121826',
                  border: isSelected ? '1px solid #4f46e5' : '1px solid #1e283d',
                  whiteSpace: 'nowrap'
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Quizzes Grid */}
        {filteredQuizzes.length === 0 ? (
          <div style={{
            background: '#121826',
            border: '1px solid #1e283d',
            padding: '40px',
            textAlign: 'center',
            borderRadius: '16px'
          }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>🔍</div>
            <h3 style={{ fontSize: '17px', color: '#ffffff', marginBottom: '4px' }}>Hech qanday quiz topilmadi</h3>
            <p style={{ fontSize: '13px', color: '#94a3b8' }}>Boshqa kategoriya yoki qidiruv so'zini sinab ko'ring</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '18px'
          }}>
            {filteredQuizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                onPlaySolo={onPlaySolo}
                onHostLobby={onHostLobby}
              />
            ))}
          </div>
        )}
      </section>

      {/* Bottom CTA Banner */}
      <section style={{
        marginTop: '36px',
        padding: '28px',
        borderRadius: '16px',
        background: '#121826',
        border: '1px solid #1e283d',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '18px'
      }}>
        <div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff', marginBottom: '4px' }}>
            O'zingizning shaxsiy quizlaringiz bormi?
          </div>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>
            Bir necha daqiqada o'z savollaringizni kiriting va do'stlaringizga ulashing!
          </p>
        </div>
        <button
          onClick={() => {
            soundManager.playClick();
            onGoToCreate();
          }}
          className="btn-solid-primary"
          style={{
            fontSize: '14px',
            padding: '12px 24px',
            borderRadius: '12px'
          }}
        >
          <PlusCircle size={16} />
          <span>Yangi Quiz Yaratish</span>
        </button>
      </section>
    </div>
  );
}
