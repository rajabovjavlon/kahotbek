import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Crown, 
  Flame, 
  Medal, 
  ShieldCheck, 
  Zap, 
  Award,
  Users
} from 'lucide-react';
import { soundManager } from '../utils/sounds';

export default function LeaderboardView({ user }) {
  const [filter, setFilter] = useState('all');
  const [realRankings, setRealRankings] = useState([]);

  useEffect(() => {
    const savedPlayers = localStorage.getItem('kahotbek_real_players');
    let playersList = [];
    if (savedPlayers) {
      try { playersList = JSON.parse(savedPlayers); } catch (e) {}
    }

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
    <div style={{ maxWidth: '950px', margin: '0 auto', padding: '24px 20px 60px' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '5px 14px',
          background: 'rgba(245, 158, 11, 0.12)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '9999px',
          color: '#fbbf24',
          fontSize: '12px',
          fontWeight: '800',
          marginBottom: '8px'
        }}>
          <Trophy size={15} />
          <span>Haqiqiy O'yinchilar Reytingi</span>
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#ffffff' }}>
          Peshqadamlar Jadvali
        </h1>
        <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '2px' }}>
          O'yinlarda to'plangan real ballar va g'alabalar bo'yicha jonli peshqadamlar
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '6px',
        marginBottom: '24px'
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
              padding: '7px 16px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: '700',
              background: filter === tab.id ? '#4f46e5' : '#121826',
              border: filter === tab.id ? '1px solid #4f46e5' : '1px solid #1e283d',
              color: filter === tab.id ? '#ffffff' : '#94a3b8'
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
          gap: '14px',
          marginBottom: '26px'
        }}>
          {realRankings.slice(0, 3).map((player, i) => (
            <div
              key={i}
              className="anim-pop"
              style={{
                padding: '20px 14px',
                borderRadius: '16px',
                textAlign: 'center',
                background: '#121826',
                border: i === 0 ? '2px solid #f59e0b' : '1px solid #1e283d'
              }}
            >
              <div style={{ fontSize: '22px', marginBottom: '4px' }}>{getBadge(i + 1)}</div>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: '#0284c7',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                margin: '0 auto 10px'
              }}>
                {player.avatar || '🦁'}
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#ffffff', marginBottom: '2px' }}>
                {player.name}
              </h3>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>
                {player.username}
              </div>
              <div style={{ fontSize: '11px', color: '#818cf8', fontWeight: '700', marginBottom: '6px' }}>
                {getLeague(player.xp || 0)}
              </div>
              <div style={{ fontSize: '15px', fontWeight: '900', color: '#fbbf24' }}>
                ⚡ {(player.xp || 0).toLocaleString()} XP
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div style={{
        background: '#121826',
        border: '1px solid #1e283d',
        padding: '12px',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
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
                padding: '12px 16px',
                borderRadius: '12px',
                background: isMe ? '#1a2336' : '#0e1422',
                border: isMe ? '1px solid #4f46e5' : '1px solid #1e283d'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '24px',
                  fontSize: '14px',
                  fontWeight: '900',
                  color: idx < 3 ? '#fbbf24' : '#94a3b8'
                }}>
                  #{idx + 1}
                </div>

                <div style={{ fontSize: '22px' }}>{p.avatar || '🦁'}</div>

                <div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{p.name}</span>
                    {isMe && (
                      <span style={{ fontSize: '10px', background: '#4f46e5', color: '#fff', padding: '1px 5px', borderRadius: '5px', fontWeight: '800' }}>
                        SIZ
                      </span>
                    )}
                    {p.isVerified && (
                      <span style={{ fontSize: '11px', color: '#0284c7' }}>✓</span>
                    )}
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                    🏆 {p.wins || 0} ta g'alaba • {getLeague(p.xp || 0)}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '15px', fontWeight: '900', color: '#38bdf8' }}>
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
