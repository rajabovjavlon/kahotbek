import React, { useState } from 'react';
import { 
  Trophy, 
  Crown, 
  Flame, 
  Medal, 
  ShieldCheck, 
  Zap, 
  Search,
  Award
} from 'lucide-react';
import { soundManager } from '../utils/sounds';

const TOP_RANKINGS = [
  { rank: 1, name: "Javlonbek Developer", avatar: "⚡", xp: 148500, wins: 142, league: "Olmos Master", badge: "👑" },
  { rank: 2, name: "Shahzod IT_King", avatar: "🤖", xp: 132400, wins: 118, league: "Olmos Master", badge: "🥈" },
  { rank: 3, name: "Malika Coding", avatar: "🐱", xp: 119800, wins: 95, league: "Olmos Master", badge: "🥉" },
  { rank: 4, name: "Sardorbek Pro", avatar: "🥷", xp: 98400, wins: 84, league: "Oltin Liga", badge: "🔥" },
  { rank: 5, name: "Zuhra Brain", avatar: "🧠", xp: 87200, wins: 76, league: "Oltin Liga", badge: "💎" },
  { rank: 6, name: "Temur Xon", avatar: "👑", xp: 76500, wins: 62, league: "Kumush Liga", badge: "⭐" },
  { rank: 7, name: "Fotima Geek", avatar: "🚀", xp: 64900, wins: 54, league: "Kumush Liga", badge: "⚡" },
  { rank: 8, name: "Bekzod Mastermind", avatar: "💡", xp: 52100, wins: 41, league: "Bronza Liga", badge: "🎯" },
];

export default function LeaderboardView({ user }) {
  const [filter, setFilter] = useState('all'); // 'all', 'weekly', 'monthly'

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 20px 60px' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          background: 'rgba(245, 158, 11, 0.15)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '9999px',
          color: '#fbbf24',
          fontSize: '13px',
          fontWeight: '800',
          marginBottom: '10px'
        }}>
          <Trophy size={16} />
          <span>Eng Kuchli Bilimdonlar</span>
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#fff' }}>
          Umumiy Reyting & Peshqadamlar
        </h1>
        <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '4px' }}>
          Har bir to'g'ri javob va g'alaba uchun XP to'plang hamda ligalarda ko'tariling!
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        marginBottom: '28px'
      }}>
        {[
          { id: 'all', label: 'Barcha Vaqtlar' },
          { id: 'monthly', label: 'Shu Oy' },
          { id: 'weekly', label: 'Shu Hafta' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              soundManager.playClick();
              setFilter(tab.id);
            }}
            style={{
              padding: '8px 20px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '700',
              background: filter === tab.id ? 'linear-gradient(135deg, #8b5cf6, #6366f1)' : 'rgba(255, 255, 255, 0.05)',
              border: filter === tab.id ? '1px solid #8b5cf6' : '1px solid rgba(255, 255, 255, 0.08)',
              color: filter === tab.id ? '#fff' : '#94a3b8'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Top 3 Cards Banner */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        marginBottom: '30px'
      }}>
        {TOP_RANKINGS.slice(0, 3).map((player, i) => (
          <div
            key={player.rank}
            className="glass-panel anim-pop"
            style={{
              padding: '24px 16px',
              borderRadius: '22px',
              textAlign: 'center',
              background: i === 0 
                ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(17, 22, 37, 0.9))' 
                : 'rgba(17, 22, 37, 0.9)',
              border: i === 0 ? '2px solid rgba(245, 158, 11, 0.5)' : '1px solid rgba(255,255,255,0.08)',
              boxShadow: i === 0 ? '0 10px 30px rgba(245, 158, 11, 0.2)' : 'none'
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>{player.badge}</div>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '18px',
              background: 'rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              margin: '0 auto 12px'
            }}>
              {player.avatar}
            </div>
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>
              {player.name}
            </h3>
            <div style={{ fontSize: '12px', color: '#a855f7', fontWeight: '700', marginBottom: '8px' }}>
              {player.league}
            </div>
            <div style={{ fontSize: '16px', fontWeight: '900', color: '#fbbf24' }}>
              ⚡ {player.xp.toLocaleString()} XP
            </div>
          </div>
        ))}
      </div>

      {/* Full Leaderboard Table */}
      <div className="glass-panel" style={{
        padding: '16px',
        borderRadius: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {TOP_RANKINGS.map((p) => (
          <div
            key={p.rank}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 20px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '28px',
                fontSize: '15px',
                fontWeight: '900',
                color: p.rank <= 3 ? '#fbbf24' : '#94a3b8'
              }}>
                #{p.rank}
              </div>

              <div style={{ fontSize: '24px' }}>{p.avatar}</div>

              <div>
                <div style={{ fontSize: '15px', fontWeight: '800', color: '#fff' }}>
                  {p.name}
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                  🏆 {p.wins} ta g'alaba • {p.league}
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '16px', fontWeight: '900', color: '#38bdf8' }}>
                ⚡ {p.xp.toLocaleString()} XP
              </div>
            </div>
          </div>
        ))}

        {/* Current User Row */}
        <div style={{
          marginTop: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 20px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.35), rgba(6, 182, 212, 0.25))',
          border: '2px solid #8b5cf6'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '28px', fontSize: '15px', fontWeight: '900', color: '#fff' }}>
              #12
            </div>
            <div style={{ fontSize: '24px' }}>{user.avatar || '⚡'}</div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>{user.name}</span>
                <span style={{ fontSize: '10px', background: '#8b5cf6', padding: '2px 6px', borderRadius: '6px' }}>SIZ</span>
              </div>
              <div style={{ fontSize: '12px', color: '#cbd5e1' }}>
                🏆 {user.wins || 12} ta g'alaba • Oltin Liga
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '16px', fontWeight: '900', color: '#38bdf8' }}>
              ⚡ {user.xp.toLocaleString()} XP
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
