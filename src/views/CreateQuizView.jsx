import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Copy, 
  Clock, 
  Award, 
  Save, 
  Play, 
  Sparkles, 
  Layers, 
  CheckCircle, 
  HelpCircle,
  Image as ImageIcon,
  Check,
  AlertCircle
} from 'lucide-react';
import { CATEGORIES } from '../data/defaultQuizzes';
import { soundManager } from '../utils/sounds';

const ANSWER_COLORS = [
  { bg: '#ef4444', name: 'Qizil', shape: '▲' },
  { bg: '#3b82f6', name: "Ko'k", shape: '◆' },
  { bg: '#f59e0b', name: 'Sariq', shape: '●' },
  { bg: '#10b981', name: 'Yashil', shape: '■' },
];

export default function CreateQuizView({ onSaveQuiz, onSaveAndPlay, initialQuiz = null }) {
  const [title, setTitle] = useState(initialQuiz?.title || '');
  const [description, setDescription] = useState(initialQuiz?.description || '');
  const [category, setCategory] = useState(initialQuiz?.category || 'Dasturlash');
  const [difficulty, setDifficulty] = useState(initialQuiz?.difficulty || "O'rta");
  const [icon, setIcon] = useState(initialQuiz?.icon || '⚡');

  const [questions, setQuestions] = useState(initialQuiz?.questions || [
    {
      id: 'q1',
      question: 'Yangi savolingiz matnini bu yerga yozing...',
      timeLimit: 20,
      points: 1000,
      type: 'multiple',
      explanation: "Savol bo'yicha qisqacha izoh...",
      options: [
        { text: 'Variant A', isCorrect: true, color: '#ef4444', shape: 'triangle' },
        { text: 'Variant B', isCorrect: false, color: '#3b82f6', shape: 'diamond' },
        { text: 'Variant C', isCorrect: false, color: '#f59e0b', shape: 'circle' },
        { text: 'Variant D', isCorrect: false, color: '#10b981', shape: 'square' },
      ]
    }
  ]);

  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const currentQ = questions[activeQuestionIndex] || questions[0];

  // Add new question
  const handleAddQuestion = () => {
    soundManager.playClick();
    const newQ = {
      id: `q_${Date.now()}`,
      question: `Savol #${questions.length + 1}`,
      timeLimit: 20,
      points: 1000,
      type: 'multiple',
      explanation: '',
      options: [
        { text: 'Variant 1', isCorrect: true, color: '#ef4444', shape: 'triangle' },
        { text: 'Variant 2', isCorrect: false, color: '#3b82f6', shape: 'diamond' },
        { text: 'Variant 3', isCorrect: false, color: '#f59e0b', shape: 'circle' },
        { text: 'Variant 4', isCorrect: false, color: '#10b981', shape: 'square' },
      ]
    };
    setQuestions([...questions, newQ]);
    setActiveQuestionIndex(questions.length);
  };

  // Duplicate question
  const handleDuplicateQuestion = (idx) => {
    soundManager.playClick();
    const qToDup = { ...questions[idx], id: `q_${Date.now()}` };
    const newQs = [...questions];
    newQs.splice(idx + 1, 0, qToDup);
    setQuestions(newQs);
    setActiveQuestionIndex(idx + 1);
  };

  // Delete question
  const handleDeleteQuestion = (idx) => {
    soundManager.playClick();
    if (questions.length <= 1) {
      setError("Quizda kamida bitta savol bo'lishi shart!");
      return;
    }
    const newQs = questions.filter((_, i) => i !== idx);
    setQuestions(newQs);
    setActiveQuestionIndex(Math.max(0, idx - 1));
  };

  // Update current question fields
  const updateCurrentQuestion = (field, value) => {
    const updated = [...questions];
    updated[activeQuestionIndex] = {
      ...updated[activeQuestionIndex],
      [field]: value
    };
    setQuestions(updated);
  };

  // Update option text or correct state
  const updateOption = (optIdx, field, value) => {
    const updated = [...questions];
    const opts = [...updated[activeQuestionIndex].options];
    
    if (field === 'isCorrect') {
      // Toggle or make single correct
      opts.forEach((o, i) => {
        if (i === optIdx) {
          o.isCorrect = value;
        } else {
          o.isCorrect = false; // Single correct kahoot style
        }
      });
    } else {
      opts[optIdx][field] = value;
    }

    updated[activeQuestionIndex].options = opts;
    setQuestions(updated);
  };

  // Validate and Build Quiz Object
  const validateAndBuildQuiz = () => {
    if (!title.trim()) {
      setError("Iltimos, quiz sarlavhasini (nomini) kiriting!");
      return null;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        setError(`${i + 1}-savol matni bo'sh bo'lishi mumkin emas!`);
        return null;
      }
      const hasCorrect = q.options.some(o => o.isCorrect);
      if (!hasCorrect) {
        setError(`${i + 1}-savolda to'g'ri javob belgilanmagan!`);
        return null;
      }
    }

    setError('');
    return {
      id: initialQuiz?.id || `user-quiz-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || 'Foydalanuvchi tomonidan yaratilgan maxsus quiz',
      category,
      difficulty,
      playsCount: initialQuiz?.playsCount || 0,
      rating: 5.0,
      author: 'Siz',
      authorAvatar: icon,
      icon,
      coverGradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
      questions,
      createdAt: new Date().toISOString()
    };
  };

  const handleSave = () => {
    const quiz = validateAndBuildQuiz();
    if (!quiz) return;
    soundManager.playCorrect();
    onSaveQuiz(quiz);
    setSuccessMessage("Quiz muvaffaqiyatli saqlandi!");
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleSaveAndStart = () => {
    const quiz = validateAndBuildQuiz();
    if (!quiz) return;
    soundManager.playStartGame();
    onSaveAndPlay(quiz);
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px 20px 60px' }}>
      {/* Studio Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '28px' }}>🎨</span>
            <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#fff' }}>
              Kahoot Quiz Yaratish Studiyasi
            </h1>
          </div>
          <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '4px' }}>
            Savollar, javob variantlari va taymerlarni erkin sozlang
          </p>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleSave}
            className="btn-glass"
            style={{ padding: '10px 20px', borderRadius: '12px' }}
          >
            <Save size={16} />
            <span>Saqlash</span>
          </button>

          <button
            onClick={handleSaveAndStart}
            className="btn-neon-primary"
            style={{ padding: '10px 22px', borderRadius: '12px' }}
          >
            <Play size={16} fill="#fff" />
            <span>Saqlash va O'ynash</span>
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          color: '#fca5a5',
          padding: '12px 18px',
          borderRadius: '14px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <AlertCircle size={20} color="#ef4444" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          color: '#86efac',
          padding: '12px 18px',
          borderRadius: '14px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <CheckCircle size={20} color="#10b981" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Studio Grid: Left Sidebar (Questions), Center (Question Editor), Right (Settings) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '260px 1fr 300px',
        gap: '20px',
        alignItems: 'start'
      }}>
        {/* Left Panel: Questions List */}
        <div className="glass-panel" style={{
          padding: '16px',
          borderRadius: '20px',
          maxHeight: 'calc(100vh - 180px)',
          overflowY: 'auto'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '14px',
            paddingBottom: '10px',
            borderBottom: '1px solid rgba(255,255,255,0.08)'
          }}>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#cbd5e1', textTransform: 'uppercase' }}>
              Savollar ({questions.length})
            </div>
            <button
              onClick={handleAddQuestion}
              style={{
                background: '#8b5cf6',
                color: '#fff',
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Yangi savol qo'shish"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Question List Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {questions.map((q, idx) => {
              const isActive = activeQuestionIndex === idx;
              return (
                <div
                  key={q.id || idx}
                  onClick={() => {
                    soundManager.playClick();
                    setActiveQuestionIndex(idx);
                  }}
                  style={{
                    padding: '12px',
                    borderRadius: '14px',
                    background: isActive ? 'rgba(139, 92, 246, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                    border: isActive ? '2px solid #8b5cf6' : '1px solid rgba(255, 255, 255, 0.06)',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '800', color: isActive ? '#a855f7' : '#94a3b8' }}>
                      {idx + 1}-Savol ({q.timeLimit}s)
                    </span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicateQuestion(idx);
                        }}
                        style={{
                          background: 'transparent',
                          color: '#94a3b8',
                          padding: '2px'
                        }}
                        title="Nusxa olish"
                      >
                        <Copy size={13} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteQuestion(idx);
                        }}
                        style={{
                          background: 'transparent',
                          color: '#ef4444',
                          padding: '2px'
                        }}
                        title="O'chirish"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#f8fafc',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {q.question || 'Savol matni yo\'q'}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleAddQuestion}
            style={{
              width: '100%',
              marginTop: '16px',
              padding: '10px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px dashed rgba(255,255,255,0.2)',
              color: '#38bdf8',
              fontSize: '13px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Plus size={16} />
            <span>Savol Qo'shish</span>
          </button>
        </div>

        {/* Center Panel: Active Question Editor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Question Text Box */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '24px' }}>
            <label style={{ fontSize: '12px', fontWeight: '800', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '10px' }}>
              {activeQuestionIndex + 1}-Savol Matni
            </label>
            <textarea
              rows={3}
              value={currentQ.question}
              onChange={(e) => updateCurrentQuestion('question', e.target.value)}
              placeholder="Savolingizni bu yerga kiriting (masalan: O'zbekiston poytaxti qaysi shahar?)"
              style={{
                width: '100%',
                background: '#090c15',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '16px',
                padding: '16px',
                color: '#fff',
                fontSize: '18px',
                fontWeight: '700',
                resize: 'vertical',
                lineHeight: 1.4
              }}
            />
          </div>

          {/* 4 Colored Kahoot Answers Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px'
          }}>
            {currentQ.options.map((opt, optIdx) => {
              const colorInfo = ANSWER_COLORS[optIdx] || ANSWER_COLORS[0];
              return (
                <div
                  key={optIdx}
                  style={{
                    background: '#111625',
                    borderRadius: '18px',
                    border: `2px solid ${opt.isCorrect ? colorInfo.bg : 'rgba(255, 255, 255, 0.08)'}`,
                    padding: '16px',
                    position: 'relative',
                    boxShadow: opt.isCorrect ? `0 0 20px ${colorInfo.bg}40` : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '10px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        background: colorInfo.bg,
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '900',
                        fontSize: '14px'
                      }}>
                        {colorInfo.shape}
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: '800', color: colorInfo.bg }}>
                        Variant {optIdx + 1}
                      </span>
                    </div>

                    {/* Toggle Correct Answer */}
                    <button
                      type="button"
                      onClick={() => {
                        soundManager.playClick();
                        updateOption(optIdx, 'isCorrect', !opt.isCorrect);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '10px',
                        background: opt.isCorrect ? '#10b981' : 'rgba(255, 255, 255, 0.06)',
                        color: opt.isCorrect ? '#fff' : '#94a3b8',
                        fontSize: '12px',
                        fontWeight: '700'
                      }}
                    >
                      {opt.isCorrect ? (
                        <>
                          <Check size={14} />
                          <span>To'g'ri Javob</span>
                        </>
                      ) : (
                        <span>To'g'ri deb belgilash</span>
                      )}
                    </button>
                  </div>

                  <input
                    type="text"
                    value={opt.text}
                    onChange={(e) => updateOption(optIdx, 'text', e.target.value)}
                    placeholder={`Javob variantini kiriting...`}
                    style={{
                      width: '100%',
                      background: '#090c15',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '12px 14px',
                      color: '#fff',
                      fontSize: '15px',
                      fontWeight: '600'
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Explanation / Notes */}
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '20px' }}>
            <label style={{ fontSize: '12px', fontWeight: '800', color: '#cbd5e1', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <HelpCircle size={15} color="#8b5cf6" />
              <span>Savol Izohi / Yechim (Ixtiyoriy)</span>
            </label>
            <input
              type="text"
              value={currentQ.explanation || ''}
              onChange={(e) => updateCurrentQuestion('explanation', e.target.value)}
              placeholder="O'yinchilarga javob ko'rsatilganda tushuntirish beriladi..."
              style={{
                width: '100%',
                background: '#090c15',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '10px 14px',
                color: '#fff',
                fontSize: '14px'
              }}
            />
          </div>
        </div>

        {/* Right Panel: Quiz & Question Configuration */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Question specific settings */}
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={16} color="#06b6d4" />
              <span>Savol Sozlamalari</span>
            </h3>

            {/* Time Limit */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                Vaqt chegarasi (sekund)
              </label>
              <select
                value={currentQ.timeLimit}
                onChange={(e) => updateCurrentQuestion('timeLimit', parseInt(e.target.value))}
                style={{
                  width: '100%',
                  background: '#090c15',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '10px',
                  color: '#fff',
                  fontSize: '14px'
                }}
              >
                <option value={5}>5 sekund (Ekstremal)</option>
                <option value={10}>10 sekund</option>
                <option value={15}>15 sekund</option>
                <option value={20}>20 sekund (Standart)</option>
                <option value={30}>30 sekund</option>
                <option value={60}>60 sekund</option>
              </select>
            </div>

            {/* Points */}
            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                Ball miqdori
              </label>
              <select
                value={currentQ.points}
                onChange={(e) => updateCurrentQuestion('points', parseInt(e.target.value))}
                style={{
                  width: '100%',
                  background: '#090c15',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '10px',
                  color: '#fff',
                  fontSize: '14px'
                }}
              >
                <option value={1000}>Standart (1,000 ball)</option>
                <option value={2000}>2x Dubl Ball (2,000 ball)</option>
                <option value={0}>Ballsiz (Mashq)</option>
              </select>
            </div>
          </div>

          {/* Overall Quiz Details */}
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#fff', marginBottom: '14px' }}>
              Quiz Ma'lumotlari
            </h3>

            {/* Title */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                Quiz Nomi
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Masalan: Web Dasturlash 2026"
                style={{
                  width: '100%',
                  background: '#090c15',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '10px',
                  color: '#fff',
                  fontSize: '14px'
                }}
              />
            </div>

            {/* Category */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                Kategoriya
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  background: '#090c15',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '10px',
                  color: '#fff',
                  fontSize: '14px'
                }}
              >
                {CATEGORIES.filter(c => c !== 'Barchasi').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                Qiyinlik darajasi
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                style={{
                  width: '100%',
                  background: '#090c15',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '10px',
                  color: '#fff',
                  fontSize: '14px'
                }}
              >
                <option value="Oson">Oson</option>
                <option value="O'rta">O'rta</option>
                <option value="Qiyin">Qiyin</option>
                <option value="Pro">Pro</option>
              </select>
            </div>

            {/* Icon */}
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                Quiz Ikonkasi
              </label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {['⚡', '💻', '🤖', '🧠', '🏛️', '🇬🇧', '🏆', '🎯', '🚀', '🔥', '💎', '🧩'].map(ic => (
                  <button
                    key={ic}
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setIcon(ic);
                    }}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      fontSize: '18px',
                      background: icon === ic ? 'rgba(139, 92, 246, 0.4)' : 'rgba(255, 255, 255, 0.05)',
                      border: icon === ic ? '2px solid #8b5cf6' : '1px solid rgba(255, 255, 255, 0.08)'
                    }}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
