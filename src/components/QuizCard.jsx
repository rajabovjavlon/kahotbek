import React from 'react';
import { Play, Users, BookOpen, Star } from 'lucide-react';
import { soundManager } from '../utils/sounds';

export default function QuizCard({ 
  quiz, 
  onPlaySolo, 
  onHostLobby, 
  onPreview 
}) {
  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'Oson': return '#10b981';
      case "O'rta": return '#0284c7';
      case 'Qiyin': return '#f59e0b';
      case 'Pro': return '#ef4444';
      default: return '#4f46e5';
    }
  };

  return (
    <div 
      className="clean-card" 
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        background: '#121826',
        border: '1px solid #1e283d',
        borderRadius: '16px'
      }}
    >
      {/* Card Top Banner (Solid dark container) */}
      <div style={{
        height: '110px',
        background: '#182234',
        borderBottom: '1px solid #222d42',
        position: 'relative',
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        {/* Top Badges */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span 
            className="badge" 
            style={{
              background: '#0e1422',
              color: '#38bdf8',
              border: '1px solid #222d42'
            }}
          >
            {quiz.category}
          </span>
          <span 
            className="badge" 
            style={{
              background: '#0e1422',
              color: getDifficultyColor(quiz.difficulty),
              border: `1px solid ${getDifficultyColor(quiz.difficulty)}40`
            }}
          >
            {quiz.difficulty}
          </span>
        </div>

        {/* Quiz Icon and Floating Stats */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '32px' }}>
            {quiz.icon || '🎯'}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: '#0e1422',
            padding: '3px 8px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '700',
            color: '#fbbf24',
            border: '1px solid #222d42'
          }}>
            <Star size={13} fill="#fbbf24" />
            <span>{quiz.rating || 4.9}</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div style={{
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        justifyContent: 'space-between'
      }}>
        <div>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '800',
            color: '#ffffff',
            lineHeight: 1.3,
            marginBottom: '6px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {quiz.title}
          </h3>

          <p style={{
            fontSize: '13px',
            color: '#94a3b8',
            lineHeight: 1.4,
            marginBottom: '12px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {quiz.description}
          </p>

          {/* Metadata info */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '12px',
            color: '#cbd5e1',
            marginBottom: '14px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <BookOpen size={14} color="#818cf8" />
              <span>{quiz.questions?.length || 5} ta savol</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Users size={14} color="#38bdf8" />
              <span>{quiz.playsCount?.toLocaleString() || '1,200'} o'ynaldi</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingTop: '10px', borderTop: '1px solid #1e283d' }}>
          {/* Solo Play Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onPlaySolo(quiz);
            }}
            className="btn-solid-green"
            style={{
              padding: '8px 10px',
              borderRadius: '10px',
              fontSize: '12px'
            }}
          >
            <Play size={13} fill="#fff" />
            <span>Solo</span>
          </button>

          {/* Host Live Room Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onHostLobby(quiz);
            }}
            className="btn-solid-primary"
            style={{
              padding: '8px 10px',
              borderRadius: '10px',
              fontSize: '12px'
            }}
          >
            <Users size={13} />
            <span>Xona Ochish</span>
          </button>
        </div>
      </div>
    </div>
  );
}
