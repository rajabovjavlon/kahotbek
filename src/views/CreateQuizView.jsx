import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Copy, 
  Clock, 
  Save, 
  Play, 
  CheckCircle, 
  HelpCircle,
  Check,
  AlertCircle
} from 'lucide-react';
import { CATEGORIES } from '../data/defaultQuizzes';
import { soundManager } from '../utils/sounds';

const ANSWER_COLORS = [
  { bg: '#dc2626', name: 'Qizil', shape: '▲' },
  { bg: '#2563eb', name: "Ko'k", shape: '◆' },
  { bg: '#d97706', name: 'Sariq', shape: '●' },
  { bg: '#059669', name: 'Yashil', shape: '■' },
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
        { text: 'Variant A', isCorrect: true, color: '#dc2626', shape: 'triangle' },
        { text: 'Variant B', isCorrect: false, color: '#2563eb', shape: 'diamond' },
        { text: 'Variant C', isCorrect: false, color: '#d97706', shape: 'circle' },
        { text: 'Variant D', isCorrect: false, color: '#059669', shape: 'square' },
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
        { text: 'Variant 1', isCorrect: true, color: '#dc2626', shape: 'triangle' },
        { text: 'Variant 2', isCorrect: false, color: '#2563eb', shape: 'diamond' },
        { text: 'Variant 3', isCorrect: false, color: '#d97706', shape: 'circle' },
        { text: 'Variant 4', isCorrect: false, color: '#059669', shape: 'square' },
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
      opts.forEach((o, i) => {
        if (i === optIdx) {
          o.isCorrect = value;
        } else {
          o.isCorrect = false;
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
      setError("Iltimos, quiz nomini kiriting!");
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
      description: description.trim() || 'Foydalanuvchi tomonidan yaratilgan quiz',
      category,
      difficulty,
      playsCount: initialQuiz?.playsCount || 0,
      rating: 5.0,
      author: 'Siz',
      authorAvatar: icon,
      icon,
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
        marginBottom: '22px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>🎨</span>
            <h1 style={{ fontSize: '26px', fontWeight: '900', color: '#ffffff' }}>
              Quiz Yaratish Studiyasi
            </h1>
          </div>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '2px' }}>
            Savollar, javob variantlari va taymerlarni sozlang
          </p>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleSave}
            className="btn-solid-secondary"
            style={{ padding: '9px 18px', borderRadius: '10px' }}
          >
            <Save size={15} />
            <span>Saqlash</span>
          </button>

          <button
            onClick={handleSaveAndStart}
            className="btn-solid-primary"
            style={{ padding: '9px 20px', borderRadius: '10px' }}
          >
            <Play size={15} fill="#fff" />
            <span>Saqlash va O'ynash</span>
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.35)',
          color: '#fca5a5',
          padding: '10px 16px',
          borderRadius: '12px',
          marginBottom: '18px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '13px'
        }}>
          <AlertCircle size={18} color="#ef4444" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          color: '#86efac',
          padding: '10px 16px',
          borderRadius: '12px',
          marginBottom: '18px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '13px'
        }}>
          <CheckCircle size={18} color="#10b981" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Studio Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '250px 1fr 280px',
        gap: '18px',
        alignItems: 'start'
      }}>
        {/* Left Panel: Questions List */}
        <div style={{
          background: '#121826',
          border: '1px solid #1e283d',
          padding: '14px',
          borderRadius: '16px',
          maxHeight: 'calc(100vh - 180px)',
          overflowY: 'auto'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
            paddingBottom: '8px',
            borderBottom: '1px solid #1e283d'
          }}>
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>
              Savollar ({questions.length})
            </div>
            <button
              onClick={handleAddQuestion}
              style={{
                background: '#4f46e5',
                color: '#fff',
                width: '26px',
                height: '26px',
                borderRadius: '7px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Yangi savol qo'shish"
            >
              <Plus size={15} />
            </button>
          </div>

          {/* Question List Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
                    padding: '10px 12px',
                    borderRadius: '10px',
                    background: isActive ? '#1c273c' : '#0e1422',
                    border: isActive ? '2px solid #4f46e5' : '1px solid #1e283d',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: isActive ? '#818cf8' : '#94a3b8' }}>
                      {idx + 1}-Savol ({q.timeLimit}s)
                    </span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicateQuestion(idx);
                        }}
                        style={{ background: 'transparent', color: '#94a3b8', padding: '2px' }}
                        title="Nusxa olish"
                      >
                        <Copy size={12} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteQuestion(idx);
                        }}
                        style={{ background: 'transparent', color: '#ef4444', padding: '2px' }}
                        title="O'chirish"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  <div style={{
                    fontSize: '12px',
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
              marginTop: '14px',
              padding: '9px',
              borderRadius: '10px',
              background: '#0e1422',
              border: '1px dashed #283652',
              color: '#38bdf8',
              fontSize: '12px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Plus size={15} />
            <span>Savol Qo'shish</span>
          </button>
        </div>

        {/* Center Panel: Active Question Editor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Question Text Box */}
          <div style={{
            background: '#121826',
            border: '1px solid #1e283d',
            padding: '20px',
            borderRadius: '16px'
          }}>
            <label style={{ fontSize: '12px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              {activeQuestionIndex + 1}-Savol Matni
            </label>
            <textarea
              rows={3}
              value={currentQ.question}
              onChange={(e) => updateCurrentQuestion('question', e.target.value)}
              placeholder="Savolingizni bu yerga kiriting..."
              style={{
                width: '100%',
                background: '#0e1422',
                border: '1px solid #222d42',
                borderRadius: '12px',
                padding: '14px',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: '700',
                resize: 'vertical',
                lineHeight: 1.4
              }}
            />
          </div>

          {/* 4 Colored Solid Kahoot Answers Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '14px'
          }}>
            {currentQ.options.map((opt, optIdx) => {
              const colorInfo = ANSWER_COLORS[optIdx] || ANSWER_COLORS[0];
              return (
                <div
                  key={optIdx}
                  style={{
                    background: '#121826',
                    borderRadius: '14px',
                    border: `2px solid ${opt.isCorrect ? colorInfo.bg : '#1e283d'}`,
                    padding: '14px',
                    position: 'relative'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '10px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '7px',
                        background: colorInfo.bg,
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '900',
                        fontSize: '13px'
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
                        gap: '4px',
                        padding: '5px 10px',
                        borderRadius: '8px',
                        background: opt.isCorrect ? '#059669' : '#1c273c',
                        color: opt.isCorrect ? '#fff' : '#94a3b8',
                        fontSize: '11px',
                        fontWeight: '700'
                      }}
                    >
                      {opt.isCorrect ? (
                        <>
                          <Check size={13} />
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
                      background: '#0e1422',
                      border: '1px solid #222d42',
                      borderRadius: '10px',
                      padding: '10px 12px',
                      color: '#ffffff',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Explanation / Notes */}
          <div style={{
            background: '#121826',
            border: '1px solid #1e283d',
            padding: '16px',
            borderRadius: '14px'
          }}>
            <label style={{ fontSize: '12px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <HelpCircle size={14} color="#818cf8" />
              <span>Savol Izohi / Tushuntirish (Ixtiyoriy)</span>
            </label>
            <input
              type="text"
              value={currentQ.explanation || ''}
              onChange={(e) => updateCurrentQuestion('explanation', e.target.value)}
              placeholder="O'yinchilarga javob ko'rsatilganda tushuntirish beriladi..."
              style={{
                width: '100%',
                background: '#0e1422',
                border: '1px solid #222d42',
                borderRadius: '10px',
                padding: '9px 12px',
                color: '#ffffff',
                fontSize: '13px'
              }}
            />
          </div>
        </div>

        {/* Right Panel: Quiz Configuration */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Question specific settings */}
          <div style={{
            background: '#121826',
            border: '1px solid #1e283d',
            padding: '16px',
            borderRadius: '16px'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#ffffff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={15} color="#0284c7" />
              <span>Savol Sozlamalari</span>
            </h3>

            {/* Time Limit */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                Vaqt chegarasi (sekund)
              </label>
              <select
                value={currentQ.timeLimit}
                onChange={(e) => updateCurrentQuestion('timeLimit', parseInt(e.target.value))}
                style={{
                  width: '100%',
                  background: '#0e1422',
                  border: '1px solid #222d42',
                  borderRadius: '8px',
                  padding: '8px',
                  color: '#ffffff',
                  fontSize: '13px'
                }}
              >
                <option value={5}>5 sekund</option>
                <option value={10}>10 sekund</option>
                <option value={15}>15 sekund</option>
                <option value={20}>20 sekund (Standart)</option>
                <option value={30}>30 sekund</option>
                <option value={60}>60 sekund</option>
              </select>
            </div>

            {/* Points */}
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                Ball miqdori
              </label>
              <select
                value={currentQ.points}
                onChange={(e) => updateCurrentQuestion('points', parseInt(e.target.value))}
                style={{
                  width: '100%',
                  background: '#0e1422',
                  border: '1px solid #222d42',
                  borderRadius: '8px',
                  padding: '8px',
                  color: '#ffffff',
                  fontSize: '13px'
                }}
              >
                <option value={1000}>Standart (1,000 ball)</option>
                <option value={2000}>2x Ball (2,000 ball)</option>
                <option value={0}>Ballsiz</option>
              </select>
            </div>
          </div>

          {/* Overall Quiz Details */}
          <div style={{
            background: '#121826',
            border: '1px solid #1e283d',
            padding: '16px',
            borderRadius: '16px'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#ffffff', marginBottom: '12px' }}>
              Quiz Ma'lumotlari
            </h3>

            {/* Title */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                Quiz Nomi
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Masalan: Web Dasturlash 2026"
                style={{
                  width: '100%',
                  background: '#0e1422',
                  border: '1px solid #222d42',
                  borderRadius: '8px',
                  padding: '8px 10px',
                  color: '#ffffff',
                  fontSize: '13px'
                }}
              />
            </div>

            {/* Category */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                Kategoriya
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  background: '#0e1422',
                  border: '1px solid #222d42',
                  borderRadius: '8px',
                  padding: '8px',
                  color: '#ffffff',
                  fontSize: '13px'
                }}
              >
                {CATEGORIES.filter(c => c !== 'Barchasi').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                Qiyinlik darajasi
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                style={{
                  width: '100%',
                  background: '#0e1422',
                  border: '1px solid #222d42',
                  borderRadius: '8px',
                  padding: '8px',
                  color: '#ffffff',
                  fontSize: '13px'
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
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      fontSize: '16px',
                      background: icon === ic ? '#1e2842' : '#0e1422',
                      border: icon === ic ? '2px solid #4f46e5' : '1px solid #222d42'
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
