import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Crown, 
  Flame, 
  Medal, 
  ShieldCheck, 
  Zap, 
  Search,
  Award,
  Users
} from 'lucide-react';
import { soundManager } from '../utils/sounds';

export default function LeaderboardView({ user }) {
  const [filter, setFilter] = useState('all'); // 'all', 'weekly', 'monthly'
  const [realRankings, setRealRankings] = useState([]);

  useEffect(() => {
    // Load real players history from localStorage
    const savedPlayers = localStorage.getItem('kahotbek_real_players');
    let playersList = [];
    if (savedPlayers) {
      try { playersList = JSON.parse(savedPlayers); } catch (e) {}
    }

    // Ensure current user is in the list
    const existingIndex = playersList.findIndex(p => p.name === user.name);
    const currentUserEntry = {
      name: user.name,
      username: user.username || `@${user.name.toLowerCase().replace(/\s+/g, '_')}`,
      avatar: user.avatar || '🦁',
      xp: user.xp || 0,
      wins: user.wins || 0,
      isVerified: user.isVerified || false
    };

    if (existingIndex >= 0) {
      playersList[existingIndex] = currentUserEntry;
    } else {
      playersList.push(currentUserEntry);
    }

    // Sort by XP descending
    playersList.sort((a, b) => (b.xp || 0) - (a.xp || 0));

    setRealRankings(playersList);
    localStorage.setItem('kahotbek_real_players', JSON.stringify(playersList));
  }, [user]);

  const getLeague = (xp) => {
    if (xp >= 10000) return 'Olmos Master';
    if (xp >= 5000) return 'Oltin Liga';
    if (xp >= 2000) return 'Kumush Liga';
    return 'Bronza Liga';
  };

  const getBadge = (rank) => {
    if (rank === 1) return '👑';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '⭐';
  };

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
          <span>Haqiqiy O'yinchilar Reytingi</span>
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#fff' }}>
          Peshqadamlar Jadvali
        </h1>
        <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '4px' }}>
          O'yinlarda to'plangan real ballar va g'alabalar bo'yicha jonli peshqadamlar
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

      {/* Top 3 Real Cards */}
      {realRankings.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(realRankings.length, 3)}, 1fr)`,
          gap: '16px',
          marginBottom: '30px'
        }}>
          {realRankings.slice(0, 3).map((player, i) => (
            <div
              key={i}
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
              <div style={{ fontSize: '24px', marginBottom: '4px' }}>{getBadge(i + 1)}</div>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '18px',
                background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                margin: '0 auto 12px',
                boxShadow: '0 0 20px rgba(14, 165, 233, 0.3)'
              }}>
                {player.avatar || '🦁'}
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#fff', marginBottom: '2px' }}>
                {player.name}
              </h3>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>
                {player.username}
              </div>
              <div style={{ fontSize: '12px', color: '#a855f7', fontWeight: '700', marginBottom: '8px' }}>
                {getLeague(player.xp || 0)}
              </div>
              <div style={{ fontSize: '16px', fontWeight: '900', color: '#fbbf24' }}>
                ⚡ {(player.xp || 0).toLocaleString()} XP
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className="glass-panel" style={{
        padding: '16px',
        borderRadius: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {realRankings.map((p, idx) => {
          const isMe = p.name === user.name;
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 20px',
                borderRadius: '16px',
                background: isMe 
                  ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(6, 182, 212, 0.2))' 
                  : 'rgba(255, 255, 255, 0.03)',
                border: isMe ? '2px solid #8b5cf6' : '1px solid rgba(255, 255, 255, 0.06)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '28px',
                  fontSize: '15px',
                  fontWeight: '900',
                  color: idx < 3 ? '#fbbf24' : '#94a3b8'
                }}>
                  #{idx + 1}
                </div>

                <div style={{ fontSize: '24px' }}>{p.avatar || '🦁'}</div>

                <div>
                  <div style={{ fontSize: '15px', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{p.name}</span>
                    {isMe && (
                      <span style={{ fontSize: '10px', background: '#8b5cf6', color: '#fff', padding: '2px 6px', borderRadius: '6px', fontWeight: '800' }}>
                        SIZ
                      </span>
                    )}
                    {p.isVerified && (
                      <span style={{ fontSize: '11px', color: '#0ea5e9' }}>✓</span>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                    🏆 {p.wins || 0} ta g'alaba • {getLeague(p.xp || 0)}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '16px', fontWeight: '900', color: '#38bdf8' }}>
                  ⚡ {(p.xp || 0).toLocaleString()} XP
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
