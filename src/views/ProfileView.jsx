import React, { useState } from 'react';
import { 
  User, 
  Award, 
  Flame, 
  Sparkles, 
  Edit3, 
  Trash2, 
  Play, 
  PlusCircle, 
  Trophy, 
  Layers, 
  CheckCircle,
  Clock
} from 'lucide-react';
import QuizCard from '../components/QuizCard';
import { soundManager } from '../utils/sounds';

export default function ProfileView({
  user,
  myQuizzes,
  onPlaySolo,
  onHostLobby,
  onEditQuiz,
  onDeleteQuiz,
  onGoToCreate,
  onOpenAuthModal
}) {
  const [activeTab, setActiveTab] = useState('quizzes'); // 'quizzes', 'achievements', 'history'

  const achievements = [
    { id: 'ach1', title: 'Birinchi G\'alaba', desc: '1-o\'rinni egallash', icon: '🏆', unlocked: true },
    { id: 'ach2', title: 'Quiz Muallifi', desc: 'Shaxsiy quiz yaratish', icon: '✍️', unlocked: myQuizzes.length > 0 },
    { id: 'ach3', title: 'Streak Olovi', desc: '5 ta ketma-ket to\'g\'ri javob', icon: '🔥', unlocked: true },
    { id: 'ach4', title: 'IT Guru', desc: 'Dasturlash quizida 100% natija', icon: '💻', unlocked: true },
    { id: 'ach5', title: 'Tezkor Fikrlash', desc: 'Savolga 3 sekund ichida javob berish', icon: '⚡', unlocked: false },
    { id: 'ach6', title: 'Kiber Chempion', desc: '10 ta jonli o\'yinda qatnashish', icon: '👑', unlocked: false },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 20px 60px' }}>
      {/* Profile Header Card */}
      <div className="glass-panel" style={{
        padding: '30px',
        borderRadius: '26px',
        background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.9), rgba(17, 22, 37, 0.95))',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
        marginBottom: '32px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          {/* User Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
              boxShadow: '0 0 30px rgba(139, 92, 246, 0.5)'
            }}>
              {user.avatar || '⚡'}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontSize: '26px', fontWeight: '900', color: '#fff' }}>
                  {user.name}
                </h1>
                <span className="badge" style={{ background: '#8b5cf6', color: '#fff' }}>
                  LVL {user.level || 5}
                </span>
              </div>
              <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '2px' }}>
                Kahotbek faol bilimdoni • Oltin Liga a'zosi
              </p>

              {/* XP Progress bar */}
              <div style={{ marginTop: '10px', width: '240px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#cbd5e1', marginBottom: '4px' }}>
                  <span>Daraja daromadi</span>
                  <span style={{ color: '#38bdf8', fontWeight: '700' }}>{user.xp % 1000} / 1000 XP</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${((user.xp % 1000) / 1000) * 100}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #8b5cf6, #06b6d4)',
                    borderRadius: '9999px'
                  }} />
                </div>
              </div>
            </div>
          </div>

          {/* Edit Profile Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenAuthModal();
            }}
            className="btn-glass"
            style={{ padding: '10px 20px', borderRadius: '12px' }}
          >
            <Edit3 size={16} />
            <span>Profilni Tahrirlash</span>
          </button>
        </div>

        {/* Counters */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '14px',
          marginTop: '28px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255,255,255,0.08)'
        }}>
          {[
            { label: 'Jami XP', val: `⚡ ${user.xp.toLocaleString()}`, color: '#c084fc' },
            { label: 'Tangalar', val: `🪙 ${user.coins}`, color: '#fbbf24' },
            { label: 'G\'alabalar', val: `🏆 ${user.wins || 12}`, color: '#34d399' },
            { label: 'Yaratilgan Quizlar', val: `✍️ ${myQuizzes.length}`, color: '#38bdf8' },
          ].map((item, idx) => (
            <div key={idx} style={{
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '12px 16px',
              borderRadius: '14px',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>{item.label}</div>
              <div style={{ fontSize: '18px', fontWeight: '900', color: item.color, marginTop: '2px' }}>
                {item.val}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs: My Quizzes vs Achievements */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '24px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        paddingBottom: '12px'
      }}>
        <button
          onClick={() => {
            soundManager.playClick();
            setActiveTab('quizzes');
          }}
          style={{
            padding: '8px 18px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '700',
            background: activeTab === 'quizzes' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
            border: activeTab === 'quizzes' ? '1px solid #8b5cf6' : '1px solid transparent',
            color: activeTab === 'quizzes' ? '#c084fc' : '#94a3b8'
          }}
        >
          Mening Quizlarim ({myQuizzes.length})
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            setActiveTab('achievements');
          }}
          style={{
            padding: '8px 18px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '700',
            background: activeTab === 'achievements' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
            border: activeTab === 'achievements' ? '1px solid #8b5cf6' : '1px solid transparent',
            color: activeTab === 'achievements' ? '#c084fc' : '#94a3b8'
          }}
        >
          Yutuqlar & Medallar (6)
        </button>
      </div>

      {/* Tab 1: My Quizzes */}
      {activeTab === 'quizzes' && (
        <div>
          {myQuizzes.length === 0 ? (
            <div className="glass-panel" style={{
              padding: '60px 20px',
              textAlign: 'center',
              borderRadius: '24px'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>✍️</div>
              <h2 style={{ fontSize: '20px', color: '#fff', marginBottom: '8px' }}>
                Hozircha hech qanday quiz yaratmadingiz
              </h2>
              <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '20px' }}>
                O'z savollaringizni to'plab yangi viktorina yarating va do'stlaringiz bilan o'ynang!
              </p>
              <button
                onClick={() => {
                  soundManager.playClick();
                  onGoToCreate();
                }}
                className="btn-neon-primary"
                style={{ padding: '12px 24px', borderRadius: '14px' }}
              >
                <PlusCircle size={18} />
                <span>Birinchi Quizni Yaratish</span>
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px'
            }}>
              {myQuizzes.map((quiz) => (
                <div key={quiz.id} style={{ position: 'relative' }}>
                  <QuizCard
                    quiz={quiz}
                    onPlaySolo={onPlaySolo}
                    onHostLobby={onHostLobby}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    display: 'flex',
                    gap: '6px',
                    zIndex: 10
                  }}>
                    <button
                      onClick={() => onEditQuiz(quiz)}
                      style={{
                        background: 'rgba(0,0,0,0.65)',
                        color: '#fff',
                        padding: '6px',
                        borderRadius: '8px',
                        backdropFilter: 'blur(4px)'
                      }}
                      title="Tahrirlash"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => onDeleteQuiz(quiz.id)}
                      style={{
                        background: 'rgba(239, 68, 68, 0.7)',
                        color: '#fff',
                        padding: '6px',
                        borderRadius: '8px',
                        backdropFilter: 'blur(4px)'
                      }}
                      title="O'chirish"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Achievements */}
      {activeTab === 'achievements' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className="glass-panel"
              style={{
                padding: '18px',
                borderRadius: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                opacity: ach.unlocked ? 1 : 0.45,
                background: ach.unlocked ? 'rgba(17, 22, 37, 0.9)' : 'rgba(17, 22, 37, 0.5)',
                border: ach.unlocked ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(255,255,255,0.05)'
              }}
            >
              <div style={{
                fontSize: '28px',
                width: '50px',
                height: '50px',
                borderRadius: '14px',
                background: ach.unlocked ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                filter: ach.unlocked ? 'none' : 'grayscale(100%)'
              }}>
                {ach.icon}
              </div>

              <div>
                <div style={{ fontSize: '15px', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>{ach.title}</span>
                  {ach.unlocked && <CheckCircle size={14} color="#10b981" />}
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                  {ach.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
