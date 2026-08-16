import React, { useState } from 'react';
import { Search, Gamepad2, SlidersHorizontal } from 'lucide-react';
import QuizCard from '../components/QuizCard';
import { CATEGORIES } from '../data/defaultQuizzes';
import { soundManager } from '../utils/sounds';

export default function ExploreView({ quizzes, onPlaySolo, onHostLobby }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Barchasi');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [sortBy, setSortBy] = useState('popular');

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
      <div style={{ marginBottom: '26px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '6px'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: '#0284c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <Gamepad2 size={18} />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#ffffff' }}>
            Barcha O'yinlar & Viktorinalar
          </h1>
        </div>
        <p style={{ fontSize: '14px', color: '#94a3b8' }}>
          O'zingizga yoqqan yo'nalishni tanlang va xoh yakkaxon (Solo), xoh jonli do'stlaringiz bilan o'ynang!
        </p>
      </div>

      {/* Control Bar: Search & Filters */}
      <div style={{
        background: '#121826',
        border: '1px solid #1e283d',
        padding: '18px',
        borderRadius: '16px',
        marginBottom: '26px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        <div style={{
          display: 'flex',
          gap: '14px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          {/* Search Input */}
          <div style={{
            flex: '1 1 280px',
            display: 'flex',
            alignItems: 'center',
            background: '#0e1422',
            border: '1px solid #222d42',
            borderRadius: '12px',
            padding: '8px 14px',
            gap: '10px'
          }}>
            <Search size={16} color="#94a3b8" />
            <input
              type="text"
              placeholder="O'yin nomi, mavzu yoki muallif bo'yicha qidiruv..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                fontSize: '13px'
              }}
            />
          </div>

          {/* Difficulty Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
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
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '700',
                  background: difficultyFilter === diff ? '#4f46e5' : '#0e1422',
                  border: difficultyFilter === diff ? '1px solid #4f46e5' : '1px solid #222d42',
                  color: difficultyFilter === diff ? '#ffffff' : '#94a3b8'
                }}
              >
                {diff === 'All' ? 'Barchasi' : diff}
              </button>
            ))}
          </div>

          {/* Sorting */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
            <SlidersHorizontal size={15} color="#94a3b8" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                background: '#0e1422',
                border: '1px solid #222d42',
                borderRadius: '8px',
                padding: '6px 12px',
                color: '#ffffff',
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
          paddingBottom: '2px'
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
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '700',
                  whiteSpace: 'nowrap',
                  background: isSel ? '#4f46e5' : '#0e1422',
                  border: isSel ? '1px solid #4f46e5' : '1px solid #222d42',
                  color: isSel ? '#ffffff' : '#94a3b8'
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
        <div style={{
          background: '#121826',
          border: '1px solid #1e283d',
          padding: '50px 20px',
          textAlign: 'center',
          borderRadius: '16px'
        }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>🎯</div>
          <h2 style={{ fontSize: '18px', color: '#ffffff', marginBottom: '4px' }}>
            Mos keluvchi quizlar topilmadi
          </h2>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>
            Qidiruv so'zini o'zgartiring yoki filtrlarni tozalang
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px'
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
