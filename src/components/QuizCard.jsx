import React from 'react';
import { Play, Users, Clock, Award, Star, BookOpen, Layers } from 'lucide-react';
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
      case "O'rta": return '#3b82f6';
      case 'Qiyin': return '#f59e0b';
      case 'Pro': return '#ef4444';
      default: return '#8b5cf6';
    }
  };

  return (
    <div 
      className="glass-card" 
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        background: '#111625'
      }}
    >
      {/* Card Header / Cover Gradient */}
      <div style={{
        height: '130px',
        background: quiz.coverGradient || 'linear-gradient(135deg, #1e1b4b, #312e81)',
        position: 'relative',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        {/* Top Badges */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span 
            className="badge" 
            style={{
              background: 'rgba(0,0,0,0.45)',
              backdropFilter: 'blur(8px)',
              color: quiz.categoryColor || '#38bdf8',
              border: `1px solid ${quiz.categoryColor || '#38bdf8'}40`
            }}
          >
            {quiz.category}
          </span>
          <span 
            className="badge" 
            style={{
              background: 'rgba(0,0,0,0.5)',
              color: getDifficultyColor(quiz.difficulty),
              border: `1px solid ${getDifficultyColor(quiz.difficulty)}40`
            }}
          >
            {quiz.difficulty}
          </span>
        </div>

        {/* Quiz Icon and Floating Stats */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div style={{
            fontSize: '34px',
            filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.5))'
          }}>
            {quiz.icon || '🎯'}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(0,0,0,0.6)',
            padding: '4px 8px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: '700',
            color: '#fbbf24'
          }}>
            <Star size={13} fill="#fbbf24" />
            <span>{quiz.rating || 4.9}</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div style={{
        padding: '18px',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        justifyContent: 'space-between'
      }}>
        <div>
          <h3 style={{
            fontSize: '17px',
            fontWeight: '800',
            color: '#f8fafc',
            lineHeight: 1.3,
            marginBottom: '8px',
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
            marginBottom: '14px',
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
            marginBottom: '16px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <BookOpen size={14} color="#8b5cf6" />
              <span>{quiz.questions?.length || 5} ta savol</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Users size={14} color="#06b6d4" />
              <span>{quiz.playsCount?.toLocaleString() || '1,200'} o'ynaldi</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {/* Solo Play Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onPlaySolo(quiz);
            }}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#fff',
              padding: '9px 12px',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}
          >
            <Play size={14} fill="#fff" />
            <span>Solo O'ynash</span>
          </button>

          {/* Host Live Room Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onHostLobby(quiz);
            }}
            style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
              color: '#fff',
              padding: '9px 12px',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
            }}
          >
            <Users size={14} />
            <span>Xona Ochish</span>
          </button>
        </div>
      </div>
    </div>
  );
}
