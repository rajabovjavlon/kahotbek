import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Crown, 
  Sparkles, 
  RotateCcw, 
  Home, 
  Gamepad2, 
  Award, 
  Zap, 
  CheckCircle2, 
  Flame,
  UserCheck
} from 'lucide-react';
import { fireVictoryConfetti } from '../utils/confetti';
import { soundManager } from '../utils/sounds';

export default function PodiumView({
  quiz,
  finalScores = [],
  user,
  onPlayAgain,
  onGoHome,
  onGoExplore
}) {
  const [standings, setStandings] = useState([]);
  const [myRank, setMyRank] = useState(1);
  const [userResult, setUserResult] = useState(null);

  useEffect(() => {
    // 1. Get current game score for user
    const currentGameUser = finalScores.find(p => p.name === user.name) || finalScores[0] || {
      name: user.name,
      username: user.username || `@${user.name.toLowerCase().replace(/\s+/g, '_')}`,
      avatar: user.avatar || '🦁',
      currentScore: 1000,
      correctCount: quiz?.questions?.length || 5,
      totalQuestions: quiz?.questions?.length || 5,
      maxStreak: 3
    };

    setUserResult(currentGameUser);

    // 2. Load global real players history
    const saved = localStorage.getItem('kahotbek_real_players');
    let realPlayers = [];
    if (saved) {
      try { realPlayers = JSON.parse(saved); } catch (e) {}
    }

    // Update current user's entry with latest score/xp
    const existingIdx = realPlayers.findIndex(p => p.name === user.name);
    const updatedUserEntry = {
      name: user.name,
      username: user.username || `@${user.name.toLowerCase().replace(/\s+/g, '_')}`,
      avatar: user.avatar || '🦁',
      xp: (user.xp || 0) + (currentGameUser.currentScore || 0),
      currentScore: currentGameUser.currentScore || 0,
      wins: (user.wins || 0) + ((currentGameUser.correctCount === quiz.questions?.length) ? 1 : 0),
      isVerified: user.isVerified || false
    };

    if (existingIdx >= 0) {
      realPlayers[existingIdx] = updatedUserEntry;
    } else {
      realPlayers.push(updatedUserEntry);
    }

    // Combine any other players from this game session
    finalScores.forEach(p => {
      if (p.name !== user.name) {
        const idx = realPlayers.findIndex(rp => rp.name === p.name);
        const entry = {
          name: p.name,
          username: p.username || `@${p.name.toLowerCase().replace(/\s+/g, '_')}`,
          avatar: p.avatar || '🦁',
          xp: p.currentScore || p.score || 0,
          currentScore: p.currentScore || p.score || 0,
          wins: 0
        };
        if (idx >= 0) {
          realPlayers[idx].xp = Math.max(realPlayers[idx].xp, entry.xp);
          realPlayers[idx].currentScore = entry.currentScore;
        } else {
          realPlayers.push(entry);
        }
      }
    });

    // Sort strictly by score / xp descending
    realPlayers.sort((a, b) => (b.currentScore || b.xp || 0) - (a.currentScore || a.xp || 0));

    // Calculate actual rank of current user
    const rank = realPlayers.findIndex(p => p.name === user.name) + 1;
    setMyRank(rank > 0 ? rank : 1);
    setStandings(realPlayers);
    localStorage.setItem('kahotbek_real_players', JSON.stringify(realPlayers));

    // Celebrations based on rank
    if (rank === 1) {
      fireVictoryConfetti();
      soundManager.playFanfare();
    } else if (rank <= 3) {
      soundManager.playCorrect();
    } else {
      soundManager.playClick();
    }
  }, [finalScores, user, quiz]);

  const firstPlace = standings[0] || userResult;
  const secondPlace = standings[1] || null;
  const thirdPlace = standings[2] || null;

  const totalQuestions = quiz?.questions?.length || 5;
  const accuracy = Math.round(((userResult?.correctCount || 0) / totalQuestions) * 100);

  // Dynamic header text based on actual rank
  const getHeaderText = () => {
    if (myRank === 1) return "Tabriklaymiz! Siz 1-o'rinni egalladingiz! 👑🏆";
    if (myRank === 2) return "Ajoyib natija! Siz 2-o'rinni egalladingiz! 🥈";
    if (myRank === 3) return "Yaxshi natija! Siz 3-o'rinni egalladingiz! 🥉";
    return `Siz reytingda #${myRank}-o'rindasiz! ⚡`;
  };

  return (
    <div style={{
      maxWidth: '1050px',
      margin: '0 auto',
      padding: '24px 20px 80px',
      textAlign: 'center'
    }}>
      {/* Title */}
      <div className="anim-fade" style={{ marginBottom: '28px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          background: myRank === 1 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(14, 165, 233, 0.15)',
          border: `1px solid ${myRank === 1 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(14, 165, 233, 0.3)'}`,
          borderRadius: '9999px',
          color: myRank === 1 ? '#fbbf24' : '#38bdf8',
          fontSize: '13px',
          fontWeight: '800',
          textTransform: 'uppercase',
          marginBottom: '10px'
        }}>
          <Sparkles size={16} />
          <span>O'yin Yakunlandi • Reyting Bo'yicha O'rin: #{myRank}</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(28px, 6vw, 44px)',
          fontWeight: '900',
          color: '#fff',
          letterSpacing: '-0.02em'
        }}>
          {getHeaderText()}
        </h1>
        <p style={{ fontSize: '15px', color: '#94a3b8', marginTop: '4px' }}>
          {quiz.title}
        </p>
      </div>

      {/* 3D RISING BLOCKS PODIUM WITH REAL ANIMAL AVATARS & ACTUAL RANKS */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: '20px',
        maxWidth: '750px',
        margin: '0 auto 36px',
        paddingBottom: '20px'
      }}>
        {/* 2nd Place Silver Column */}
        {secondPlace ? (
          <div className="anim-pop" style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            animationDelay: '0.2s'
          }}>
            <div style={{ fontSize: '42px', marginBottom: '6px' }}>
              {secondPlace.avatar || '🥈'}
            </div>
            <div style={{
              fontSize: '14px',
              fontWeight: '800',
              color: '#cbd5e1',
              marginBottom: '2px',
              maxWidth: '120px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {secondPlace.name} {secondPlace.name === user.name && '(SIZ)'}
            </div>
            <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '800', marginBottom: '8px' }}>
              {(secondPlace.currentScore || secondPlace.xp || 0).toLocaleString()} ball
            </div>

            {/* Silver Block */}
            <div style={{
              width: '100%',
              height: '140px',
              background: 'linear-gradient(180deg, rgba(148, 163, 184, 0.4) 0%, rgba(51, 65, 85, 0.85) 100%)',
              border: '2px solid rgba(148, 163, 184, 0.6)',
              borderRadius: '20px 20px 0 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 12px 35px rgba(0,0,0,0.5)'
            }}>
              <div style={{ fontSize: '38px', fontWeight: '900', color: '#cbd5e1' }}>2</div>
              <div style={{ fontSize: '12px', fontWeight: '800', color: '#94a3b8' }}>KUMUSH</div>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1 }} />
        )}

        {/* 1st Place Gold Champion (TALLEST WITH #1 SCORER) */}
        {firstPlace && (
          <div className="anim-pop" style={{
            flex: 1.3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 2
          }}>
            {/* Animated Crown */}
            <div style={{
              fontSize: '32px',
              color: '#fbbf24',
              marginBottom: '-6px',
              animation: 'floatAnim 2.5s ease-in-out infinite'
            }}>
              👑
            </div>

            {/* Champion Animal Avatar */}
            <div style={{
              fontSize: '56px',
              marginBottom: '4px',
              filter: 'drop-shadow(0 0 25px rgba(245, 158, 11, 0.7))',
              animation: 'floatAnim 3s ease-in-out infinite'
            }}>
              {firstPlace.avatar || '🦁'}
            </div>

            <div style={{
              fontSize: '18px',
              fontWeight: '900',
              color: '#fbbf24',
              marginBottom: '2px',
              maxWidth: '150px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {firstPlace.name} {firstPlace.name === user.name && '(SIZ)'}
            </div>

            <div style={{
              fontSize: '16px',
              color: '#38bdf8',
              fontWeight: '900',
              marginBottom: '10px'
            }}>
              {(firstPlace.currentScore || firstPlace.xp || 0).toLocaleString()} BALL
            </div>

            {/* 1st Place Gold Pillar */}
            <div style={{
              width: '100%',
              height: '210px',
              background: 'linear-gradient(180deg, rgba(245, 158, 11, 0.45) 0%, rgba(180, 83, 9, 0.9) 100%)',
              border: '2px solid rgba(245, 158, 11, 0.8)',
              borderRadius: '24px 24px 0 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 15px 45px rgba(245, 158, 11, 0.35)'
            }}>
              <Trophy size={46} color="#fbbf24" style={{ marginBottom: '4px', filter: 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.8))' }} />
              <div style={{ fontSize: '44px', fontWeight: '900', color: '#fbbf24' }}>1</div>
              <div style={{ fontSize: '13px', fontWeight: '900', color: '#fef08a' }}>G'OLIB / CHEMPION</div>
            </div>
          </div>
        )}

        {/* 3rd Place Bronze Column */}
        {thirdPlace ? (
          <div className="anim-pop" style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            animationDelay: '0.4s'
          }}>
            <div style={{ fontSize: '42px', marginBottom: '6px' }}>
              {thirdPlace.avatar || '🥉'}
            </div>
            <div style={{
              fontSize: '14px',
              fontWeight: '800',
              color: '#d97706',
              marginBottom: '2px',
              maxWidth: '120px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {thirdPlace.name} {thirdPlace.name === user.name && '(SIZ)'}
            </div>
            <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '800', marginBottom: '8px' }}>
              {(thirdPlace.currentScore || thirdPlace.xp || 0).toLocaleString()} ball
            </div>

            {/* Bronze Block */}
            <div style={{
              width: '100%',
              height: '110px',
              background: 'linear-gradient(180deg, rgba(180, 83, 9, 0.3) 0%, rgba(120, 53, 15, 0.8) 100%)',
              border: '2px solid rgba(180, 83, 9, 0.5)',
              borderRadius: '20px 20px 0 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}>
              <div style={{ fontSize: '36px', fontWeight: '900', color: '#f59e0b' }}>3</div>
              <div style={{ fontSize: '12px', fontWeight: '800', color: '#d97706' }}>BRONZA</div>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1 }} />
        )}
      </div>

      {/* DETAILED FINAL SCORE SUMMARY CARD */}
      <div className="glass-panel anim-fade" style={{
        maxWidth: '750px',
        margin: '0 auto 36px',
        padding: '24px',
        borderRadius: '24px',
        background: 'linear-gradient(135deg, rgba(17, 22, 37, 0.95), rgba(30, 27, 75, 0.85))',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        boxShadow: '0 15px 40px rgba(0,0,0,0.6)'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#cbd5e1', textTransform: 'uppercase', marginBottom: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Award size={18} color="#8b5cf6" />
          <span>Sizning Yakuniy Natijalaringiz</span>
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px'
        }}>
          {/* Your Exact Rank */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '14px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Reytingdagi O'rningiz</div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: myRank === 1 ? '#fbbf24' : (myRank === 2 ? '#cbd5e1' : '#38bdf8'), marginTop: '2px' }}>
              #{myRank}-o'rin
            </div>
          </div>

          {/* Total Points */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '14px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>To'plangan Ball</div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#38bdf8', marginTop: '2px' }}>
              {(userResult?.currentScore || 0).toLocaleString()}
            </div>
          </div>

          {/* Correct Answers */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '14px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>To'g'ri Javoblar</div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#10b981', marginTop: '2px' }}>
              {userResult?.correctCount || 0} / {totalQuestions} <span style={{ fontSize: '13px', color: '#86efac' }}>({accuracy}%)</span>
            </div>
          </div>

          {/* Reward XP & Coins */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '14px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Mukofot</div>
            <div style={{ fontSize: '18px', fontWeight: '900', color: '#fbbf24', marginTop: '4px' }}>
              ⚡ +{userResult?.currentScore || 0} XP • 🪙 +{myRank === 1 ? 50 : 20}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '14px',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => {
            soundManager.playClick();
            onPlayAgain();
          }}
          className="btn-neon-primary"
          style={{ padding: '14px 28px', fontSize: '15px', borderRadius: '16px' }}
        >
          <RotateCcw size={18} />
          <span>Qayta O'ynash</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            onGoExplore();
          }}
          className="btn-neon-cyan"
          style={{ padding: '14px 28px', fontSize: '15px', borderRadius: '16px' }}
        >
          <Gamepad2 size={18} />
          <span>Boshqa O'yin Tanlash</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            onGoHome();
          }}
          className="btn-glass"
          style={{ padding: '14px 24px', fontSize: '15px', borderRadius: '16px' }}
        >
          <Home size={18} />
          <span>Bosh Sahifa</span>
        </button>
      </div>
    </div>
  );
}
