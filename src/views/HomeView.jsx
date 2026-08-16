import React, { useState } from 'react';
import { 
  Sparkles, 
  Play, 
  PlusCircle, 
  KeyRound, 
  Flame, 
  Trophy, 
  Users, 
  Zap, 
  Award, 
  Search, 
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Gamepad2
} from 'lucide-react';
import QuizCard from '../components/QuizCard';
import { CATEGORIES, DEFAULT_QUIZZES } from '../data/defaultQuizzes';
import { soundManager } from '../utils/sounds';

export default function HomeView({
  quizzes = [],
  user = { name: 'Kahot Master', coins: 450, avatar: '⚡' },
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
  const currentUser = user || { name: 'Kahot Master', coins: 450, avatar: '⚡' };

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
      {/* Hero Banner Section */}
      <section style={{
        position: 'relative',
        borderRadius: '28px',
        background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.9) 0%, rgba(17, 22, 37, 0.95) 50%, rgba(15, 23, 42, 0.9) 100%)',
        border: '1px solid rgba(139, 92, 246, 0.25)',
        padding: '40px 36px',
        overflow: 'hidden',
        boxShadow: '0 20px 60px -15px rgba(0, 0, 0, 0.7), 0 0 40px rgba(139, 92, 246, 0.15)',
        marginBottom: '40px'
      }}>
        {/* Glow sphere background */}
        <div style={{
          position: 'absolute',
          top: '-80px',
          right: '-80px',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, rgba(6, 182, 212, 0.1) 60%, transparent 80%)',
          filter: 'blur(50px)',
          pointerEvents: 'none'
        }} />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          <div>
            {/* Live indicator badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '9999px',
              color: '#34d399',
              fontSize: '13px',
              fontWeight: '700',
              marginBottom: '16px'
            }}>
              <span className="pulse-dot" />
              <span>120+ Jonli Xonalar Faol</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(28px, 5vw, 42px)',
              fontWeight: '900',
              lineHeight: 1.15,
              color: '#ffffff',
              marginBottom: '14px',
              letterSpacing: '-0.03em'
            }}>
              Intellektual Janglar & <br />
              <span style={{
                background: 'linear-gradient(90deg, #a855f7 0%, #38bdf8 50%, #4ade80 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Kahoot Uslubidagi Jonli Quizlar!
              </span>
            </h1>

            <p style={{
              fontSize: '16px',
              color: '#cbd5e1',
              maxWidth: '620px',
              lineHeight: 1.6,
              marginBottom: '26px'
            }}>
              Do'stlaringiz, sinfdoshlaringiz va jamoangiz bilan jonli xona oching, 6 xonali PIN kod orqali ulaning va bilimlaringizni sinab podiumga ko'tariling!
            </p>

            {/* Quick Action Buttons */}
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  soundManager.playClick();
                  onOpenJoinModal();
                }}
                className="btn-neon-cyan"
                style={{ fontSize: '15px', padding: '14px 26px', borderRadius: '16px' }}
              >
                <KeyRound size={20} />
                <span>PIN Bilan Ulanish</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  onGoToCreate();
                }}
                className="btn-neon-primary"
                style={{ fontSize: '15px', padding: '14px 26px', borderRadius: '16px' }}
              >
                <PlusCircle size={20} />
                <span>Quiz Yaratish</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  if (featuredQuiz) onPlaySolo(featuredQuiz);
                }}
                className="btn-glass"
                style={{ fontSize: '15px', padding: '14px 22px', borderRadius: '16px' }}
              >
                <Play size={18} fill="#fff" />
                <span>Tezkor Solo Mashq</span>
              </button>
            </div>
          </div>

          {/* Hero Right Quick PIN Box */}
          <div className="glass-panel" style={{
            padding: '24px',
            borderRadius: '22px',
            maxWidth: '340px',
            width: '100%',
            margin: '0 auto',
            background: 'rgba(17, 22, 37, 0.9)',
            border: '1px solid rgba(139, 92, 246, 0.35)',
            boxShadow: '0 12px 35px rgba(0,0,0,0.5)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: 'rgba(6, 182, 212, 0.2)',
                color: '#06b6d4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800'
              }}>
                #
              </div>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#fff' }}>Tezkor Kirish</h4>
                <p style={{ fontSize: '11px', color: '#94a3b8' }}>Xona PIN kodini tering</p>
              </div>
            </div>

            <div 
              onClick={onOpenJoinModal}
              style={{
                background: '#090c15',
                border: '2px dashed rgba(6, 182, 212, 0.5)',
                borderRadius: '14px',
                padding: '16px',
                textAlign: 'center',
                cursor: 'pointer',
                marginBottom: '14px',
                transition: 'all 0.2s ease'
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
              borderTop: '1px solid rgba(255,255,255,0.06)'
            }}>
              <span>👤 {currentUser.name}</span>
              <span style={{ color: '#fbbf24', fontWeight: '700' }}>🪙 {currentUser.coins || 450} Tanga</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '36px'
      }}>
        {[
          { label: "Jami O'ynalgan O'yinlar", val: "48,500+", icon: "🔥", color: "#f59e0b" },
          { label: "Tayyor Savollar Bazasi", val: "1,250+", icon: "📚", color: "#3b82f6" },
          { label: "Faol O'yinchilar", val: "12,800+", icon: "👥", color: "#10b981" },
          { label: "O'zbekistondagi №1 Quiz", val: "100% Bepul", icon: "⚡", color: "#8b5cf6" },
        ].map((st, i) => (
          <div key={i} className="glass-panel" style={{
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            borderRadius: '16px'
          }}>
            <div style={{
              fontSize: '26px',
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${st.color}30`
            }}>
              {st.icon}
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: '900', color: '#fff', lineHeight: 1.1 }}>
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
            <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Gamepad2 size={24} color="#8b5cf6" />
              <span>Ommabop Quizlar & Bellashuvlar</span>
            </h2>
            <p style={{ fontSize: '14px', color: '#94a3b8' }}>
              Turli sohalar bo'yicha eng sara intellektual o'yinlar
            </p>
          </div>

          {/* Search Box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(17, 22, 37, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '14px',
            padding: '8px 16px',
            width: '280px'
          }}>
            <Search size={18} color="#94a3b8" />
            <input
              type="text"
              placeholder="Quiz yoki mavzu qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '14px',
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
          marginBottom: '24px'
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
                  padding: '8px 16px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: isSelected ? '#fff' : '#94a3b8',
                  background: isSelected ? 'linear-gradient(135deg, #8b5cf6, #6366f1)' : 'rgba(255, 255, 255, 0.05)',
                  border: isSelected ? '1px solid rgba(139, 92, 246, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
                  whiteSpace: 'nowrap',
                  boxShadow: isSelected ? '0 4px 15px rgba(139, 92, 246, 0.3)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Quizzes Grid */}
        {filteredQuizzes.length === 0 ? (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', borderRadius: '20px' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>🔍</div>
            <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '6px' }}>Hech qanday quiz topilmadi</h3>
            <p style={{ fontSize: '14px', color: '#94a3b8' }}>Boshqa kategoriya yoki qidiruv so'zini sinab ko'ring</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px'
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
        marginTop: '40px',
        padding: '32px',
        borderRadius: '24px',
        background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)',
        border: '1px solid rgba(52, 211, 153, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        boxShadow: '0 15px 40px rgba(6, 78, 59, 0.4)'
      }}>
        <div>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#fff', marginBottom: '6px' }}>
            O'zingizning shaxsiy quiz va testlaringiz bormi?
          </div>
          <p style={{ color: '#a7f3d0', fontSize: '15px' }}>
            Bir necha daqiqada o'z savollaringizni kiriting va do'stlaringizga ulashing!
          </p>
        </div>
        <button
          onClick={() => {
            soundManager.playClick();
            onGoToCreate();
          }}
          style={{
            background: '#ffffff',
            color: '#064e3b',
            fontWeight: '800',
            fontSize: '15px',
            padding: '14px 28px',
            borderRadius: '14px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <PlusCircle size={18} />
          <span>Yangi Quiz Yaratish</span>
        </button>
      </section>
    </div>
  );
}
