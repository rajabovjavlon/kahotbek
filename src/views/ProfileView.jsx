import React, { useState } from 'react';
import { 
  User, 
  Award, 
  Sparkles, 
  Edit3, 
  Trash2, 
  Play, 
  PlusCircle, 
  Trophy, 
  CheckCircle
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
  const [activeTab, setActiveTab] = useState('quizzes');

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
      <div style={{
        padding: '26px',
        borderRadius: '20px',
        background: '#121826',
        border: '1px solid #1e283d',
        marginBottom: '28px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '18px'
        }}>
          {/* User Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '18px',
              background: '#182234',
              border: '1px solid #222d42',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '36px'
            }}>
              {user.avatar || '⚡'}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#ffffff' }}>
                  {user.name}
                </h1>
                <span className="badge" style={{ background: '#4f46e5', color: '#fff' }}>
                  LVL {user.level || 5}
                </span>
              </div>
              <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '2px' }}>
                Kahotbek faol bilimdoni • Oltin Liga a'zosi
              </p>

              {/* XP Progress bar */}
              <div style={{ marginTop: '8px', width: '220px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#cbd5e1', marginBottom: '3px' }}>
                  <span>Daraja daromadi</span>
                  <span style={{ color: '#38bdf8', fontWeight: '700' }}>{user.xp % 1000} / 1000 XP</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#0e1422', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${((user.xp % 1000) / 1000) * 100}%`,
                    height: '100%',
                    background: '#4f46e5',
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
            className="btn-solid-secondary"
            style={{ padding: '9px 18px', borderRadius: '10px' }}
          >
            <Edit3 size={15} />
            <span>Profilni Tahrirlash</span>
          </button>
        </div>

        {/* Counters */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '12px',
          marginTop: '24px',
          paddingTop: '18px',
          borderTop: '1px solid #1e283d'
        }}>
          {[
            { label: 'Jami XP', val: `⚡ ${user.xp.toLocaleString()}`, color: '#818cf8' },
            { label: 'Tangalar', val: `🪙 ${user.coins}`, color: '#fbbf24' },
            { label: 'G\'alabalar', val: `🏆 ${user.wins || 12}`, color: '#34d399' },
            { label: 'Yaratilgan Quizlar', val: `✍️ ${myQuizzes.length}`, color: '#38bdf8' },
          ].map((item, idx) => (
            <div key={idx} style={{
              background: '#0e1422',
              padding: '10px 14px',
              borderRadius: '12px',
              border: '1px solid #1e283d'
            }}>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>{item.label}</div>
              <div style={{ fontSize: '16px', fontWeight: '900', color: item.color, marginTop: '2px' }}>
                {item.val}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs: My Quizzes vs Achievements */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '20px',
        borderBottom: '1px solid #1e283d',
        paddingBottom: '10px'
      }}>
        <button
          onClick={() => {
            soundManager.playClick();
            setActiveTab('quizzes');
          }}
          style={{
            padding: '7px 16px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: '700',
            background: activeTab === 'quizzes' ? '#4f46e5' : 'transparent',
            border: activeTab === 'quizzes' ? '1px solid #4f46e5' : '1px solid transparent',
            color: activeTab === 'quizzes' ? '#ffffff' : '#94a3b8'
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
            padding: '7px 16px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: '700',
            background: activeTab === 'achievements' ? '#4f46e5' : 'transparent',
            border: activeTab === 'achievements' ? '1px solid #4f46e5' : '1px solid transparent',
            color: activeTab === 'achievements' ? '#ffffff' : '#94a3b8'
          }}
        >
          Yutuqlar & Medallar (6)
        </button>
      </div>

      {/* Tab 1: My Quizzes */}
      {activeTab === 'quizzes' && (
        <div>
          {myQuizzes.length === 0 ? (
            <div style={{
              background: '#121826',
              border: '1px solid #1e283d',
              padding: '50px 20px',
              textAlign: 'center',
              borderRadius: '16px'
            }}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>✍️</div>
              <h2 style={{ fontSize: '18px', color: '#ffffff', marginBottom: '6px' }}>
                Hozircha hech qanday quiz yaratmadingiz
              </h2>
              <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '18px' }}>
                O'z savollaringizni to'plab yangi viktorina yarating va do'stlaringiz bilan o'ynang!
              </p>
              <button
                onClick={() => {
                  soundManager.playClick();
                  onGoToCreate();
                }}
                className="btn-solid-primary"
                style={{ padding: '10px 20px', borderRadius: '10px' }}
              >
                <PlusCircle size={16} />
                <span>Birinchi Quizni Yaratish</span>
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px'
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
                    top: '10px',
                    right: '10px',
                    display: 'flex',
                    gap: '4px',
                    zIndex: 10
                  }}>
                    <button
                      onClick={() => onEditQuiz(quiz)}
                      style={{
                        background: '#0e1422',
                        border: '1px solid #222d42',
                        color: '#fff',
                        padding: '5px',
                        borderRadius: '6px'
                      }}
                      title="Tahrirlash"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      onClick={() => onDeleteQuiz(quiz.id)}
                      style={{
                        background: 'rgba(239, 68, 68, 0.8)',
                        border: '1px solid rgba(239, 68, 68, 0.4)',
                        color: '#fff',
                        padding: '5px',
                        borderRadius: '6px'
                      }}
                      title="O'chirish"
                    >
                      <Trash2 size={13} />
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
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '14px'
        }}>
          {achievements.map((ach) => (
            <div
              key={ach.id}
              style={{
                padding: '16px',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                opacity: ach.unlocked ? 1 : 0.4,
                background: '#121826',
                border: '1px solid #1e283d'
              }}
            >
              <div style={{
                fontSize: '24px',
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: '#182234',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                filter: ach.unlocked ? 'none' : 'grayscale(100%)'
              }}>
                {ach.icon}
              </div>

              <div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>{ach.title}</span>
                  {ach.unlocked && <CheckCircle size={13} color="#10b981" />}
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
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
