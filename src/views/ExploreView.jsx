import React, { useState } from 'react';
import { Search, Filter, Sparkles, Gamepad2, Play, Users, BookOpen, Star, SlidersHorizontal } from 'lucide-react';
import QuizCard from '../components/QuizCard';
import { CATEGORIES } from '../data/defaultQuizzes';
import { soundManager } from '../utils/sounds';

export default function ExploreView({ quizzes, onPlaySolo, onHostLobby }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Barchasi');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [sortBy, setSortBy] = useState('popular'); // 'popular', 'newest', 'rating'

  // Filtering
  const filtered = quizzes.filter(q => {
    const matchCat = activeCategory === 'Barchasi' || q.category === activeCategory;
    const matchDiff = difficultyFilter === 'All' || q.difficulty === difficultyFilter;
    const matchSearch = q.title.toLowerCase().includes(search.toLowerCase()) ||
                        q.description.toLowerCase().includes(search.toLowerCase()) ||
                        q.author?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchDiff && matchSearch;
  });

  // Sorting
  filtered.sort((a, b) => {
    if (sortBy === 'popular') return (b.playsCount || 0) - (a.playsCount || 0);
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px 20px 60px' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '8px'
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <Gamepad2 size={20} />
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#fff' }}>
            Barcha O'yinlar & Viktorinalar
          </h1>
        </div>
        <p style={{ fontSize: '15px', color: '#94a3b8' }}>
          O'zingizga yoqqan yo'nalishni tanlang va xoh yakkaxon (Solo), xoh jonli do'stlaringiz bilan o'ynang!
        </p>
      </div>

      {/* Control Bar: Search & Filters */}
      <div className="glass-panel" style={{
        padding: '20px',
        borderRadius: '20px',
        marginBottom: '28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          {/* Search Input */}
          <div style={{
            flex: '1 1 300px',
            display: 'flex',
            alignItems: 'center',
            background: '#090c15',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '14px',
            padding: '10px 16px',
            gap: '10px'
          }}>
            <Search size={18} color="#94a3b8" />
            <input
              type="text"
              placeholder="O'yin nomi, mavzu yoki muallif bo'yicha qidiruv..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Difficulty Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600' }}>Qiyinlik:</span>
            {['All', 'Oson', "O'rta", 'Qiyin', 'Pro'].map((diff) => (
              <button
                key={diff}
                onClick={() => {
                  soundManager.playClick();
                  setDifficultyFilter(diff);
                }}
                style={{
                  padding: '6px 12px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: '700',
                  background: difficultyFilter === diff ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                  border: difficultyFilter === diff ? '1px solid #06b6d4' : '1px solid rgba(255, 255, 255, 0.08)',
                  color: difficultyFilter === diff ? '#38bdf8' : '#94a3b8'
                }}
              >
                {diff === 'All' ? 'Barchasi' : diff}
              </button>
            ))}
          </div>

          {/* Sorting */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
            <SlidersHorizontal size={16} color="#94a3b8" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                background: '#090c15',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '10px',
                padding: '6px 12px',
                color: '#fff',
                fontSize: '13px'
              }}
            >
              <option value="popular">Eng ommabop</option>
              <option value="rating">Yuqori baholangan</option>
            </select>
          </div>
        </div>

        {/* Category Chips */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '4px'
        }}>
          {CATEGORIES.map((cat) => {
            const isSel = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  soundManager.playClick();
                  setActiveCategory(cat);
                }}
                style={{
                  padding: '6px 14px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                  background: isSel ? 'linear-gradient(135deg, #8b5cf6, #6366f1)' : 'rgba(255, 255, 255, 0.04)',
                  border: isSel ? '1px solid rgba(139, 92, 246, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
                  color: isSel ? '#fff' : '#cbd5e1'
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Results */}
      {filtered.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center', borderRadius: '24px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎯</div>
          <h2 style={{ fontSize: '20px', color: '#fff', marginBottom: '6px' }}>
            Mos keluvchi quizlar topilmadi
          </h2>
          <p style={{ fontSize: '14px', color: '#94a3b8' }}>
            Qidiruv so'zini o'zgartiring yoki filtrlarni tozalang
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {filtered.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              onPlaySolo={onPlaySolo}
              onHostLobby={onHostLobby}
            />
          ))}
        </div>
      )}
    </div>
  );
}
