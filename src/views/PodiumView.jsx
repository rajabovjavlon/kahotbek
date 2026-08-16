import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  RotateCcw, 
  Home, 
  Gamepad2, 
  Award, 
  Sparkles
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

    realPlayers.sort((a, b) => (b.currentScore || b.xp || 0) - (a.currentScore || a.xp || 0));

    const rank = realPlayers.findIndex(p => p.name === user.name) + 1;
    setMyRank(rank > 0 ? rank : 1);
    setStandings(realPlayers);
    localStorage.setItem('kahotbek_real_players', JSON.stringify(realPlayers));

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

  const getHeaderText = () => {
    if (myRank === 1) return "Tabriklaymiz! Siz 1-o'rinni egalladingiz! 👑🏆";
    if (myRank === 2) return "Ajoyib natija! Siz 2-o'rinni egalladingiz! 🥈";
    if (myRank === 3) return "Yaxshi natija! Siz 3-o'rinni egalladingiz! 🥉";
    return `Siz reytingda #${myRank}-o'rindasiz! ⚡`;
  };

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '24px 20px 80px',
      textAlign: 'center'
    }}>
      {/* Title */}
      <div className="anim-fade" style={{ marginBottom: '26px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '5px 14px',
          background: myRank === 1 ? 'rgba(245, 158, 11, 0.12)' : 'rgba(2, 132, 199, 0.12)',
          border: `1px solid ${myRank === 1 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(2, 132, 199, 0.3)'}`,
          borderRadius: '9999px',
          color: myRank === 1 ? '#fbbf24' : '#38bdf8',
          fontSize: '12px',
          fontWeight: '800',
          textTransform: 'uppercase',
          marginBottom: '8px'
        }}>
          <Sparkles size={14} />
          <span>O'yin Yakunlandi • O'rin: #{myRank}</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(24px, 5vw, 36px)',
          fontWeight: '900',
          color: '#ffffff',
          letterSpacing: '-0.02em'
        }}>
          {getHeaderText()}
        </h1>
        <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '2px' }}>
          {quiz.title}
        </p>
      </div>

      {/* Solid Clean Podium */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: '16px',
        maxWidth: '700px',
        margin: '0 auto 32px',
        paddingBottom: '10px'
      }}>
        {/* 2nd Place Silver Column */}
        {secondPlace ? (
          <div className="anim-pop" style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '36px', marginBottom: '4px' }}>
              {secondPlace.avatar || '🥈'}
            </div>
            <div style={{
              fontSize: '13px',
              fontWeight: '800',
              color: '#cbd5e1',
              marginBottom: '2px',
              maxWidth: '110px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {secondPlace.name} {secondPlace.name === user.name && '(SIZ)'}
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '800', marginBottom: '6px' }}>
              {(secondPlace.currentScore || secondPlace.xp || 0).toLocaleString()} ball
            </div>

            {/* Silver Block */}
            <div style={{
              width: '100%',
              height: '130px',
              background: '#1c273c',
              border: '1px solid #334155',
              borderRadius: '16px 16px 0 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ fontSize: '32px', fontWeight: '900', color: '#cbd5e1' }}>2</div>
              <div style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8' }}>KUMUSH</div>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1 }} />
        )}

        {/* 1st Place Champion */}
        {firstPlace && (
          <div className="anim-pop" style={{
            flex: 1.2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 2
          }}>
            <div style={{ fontSize: '28px', color: '#fbbf24', marginBottom: '-4px' }}>
              👑
            </div>

            <div style={{ fontSize: '48px', marginBottom: '2px' }}>
              {firstPlace.avatar || '🦁'}
            </div>

            <div style={{
              fontSize: '16px',
              fontWeight: '900',
              color: '#fbbf24',
              marginBottom: '2px',
              maxWidth: '140px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {firstPlace.name} {firstPlace.name === user.name && '(SIZ)'}
            </div>

            <div style={{
              fontSize: '14px',
              color: '#38bdf8',
              fontWeight: '900',
              marginBottom: '8px'
            }}>
              {(firstPlace.currentScore || firstPlace.xp || 0).toLocaleString()} BALL
            </div>

            {/* 1st Place Gold Pillar */}
            <div style={{
              width: '100%',
              height: '180px',
              background: '#252014',
              border: '2px solid #f59e0b',
              borderRadius: '18px 18px 0 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Trophy size={38} color="#fbbf24" style={{ marginBottom: '4px' }} />
              <div style={{ fontSize: '38px', fontWeight: '900', color: '#fbbf24' }}>1</div>
              <div style={{ fontSize: '11px', fontWeight: '900', color: '#fef08a' }}>G'OLIB</div>
            </div>
          </div>
        )}

        {/* 3rd Place Bronze Column */}
        {thirdPlace ? (
          <div className="anim-pop" style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '36px', marginBottom: '4px' }}>
              {thirdPlace.avatar || '🥉'}
            </div>
            <div style={{
              fontSize: '13px',
              fontWeight: '800',
              color: '#d97706',
              marginBottom: '2px',
              maxWidth: '110px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {thirdPlace.name} {thirdPlace.name === user.name && '(SIZ)'}
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '800', marginBottom: '6px' }}>
              {(thirdPlace.currentScore || thirdPlace.xp || 0).toLocaleString()} ball
            </div>

            {/* Bronze Block */}
            <div style={{
              width: '100%',
              height: '100px',
              background: '#1a1917',
              border: '1px solid #78350f',
              borderRadius: '16px 16px 0 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ fontSize: '30px', fontWeight: '900', color: '#f59e0b' }}>3</div>
              <div style={{ fontSize: '11px', fontWeight: '800', color: '#d97706' }}>BRONZA</div>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1 }} />
        )}
      </div>

      {/* FINAL SCORE SUMMARY CARD */}
      <div style={{
        maxWidth: '700px',
        margin: '0 auto 32px',
        padding: '20px',
        borderRadius: '16px',
        background: '#121826',
        border: '1px solid #1e283d'
      }}>
        <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#cbd5e1', textTransform: 'uppercase', marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <Award size={16} color="#818cf8" />
          <span>Sizning Natijalaringiz</span>
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '10px'
        }}>
          <div style={{
            background: '#0e1422',
            padding: '12px',
            borderRadius: '12px',
            border: '1px solid #1e283d'
          }}>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Reytingdagi O'rningiz</div>
            <div style={{ fontSize: '18px', fontWeight: '900', color: myRank === 1 ? '#fbbf24' : '#38bdf8', marginTop: '2px' }}>
              #{myRank}-o'rin
            </div>
          </div>

          <div style={{
            background: '#0e1422',
            padding: '12px',
            borderRadius: '12px',
            border: '1px solid #1e283d'
          }}>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>To'plangan Ball</div>
            <div style={{ fontSize: '18px', fontWeight: '900', color: '#38bdf8', marginTop: '2px' }}>
              {(userResult?.currentScore || 0).toLocaleString()}
            </div>
          </div>

          <div style={{
            background: '#0e1422',
            padding: '12px',
            borderRadius: '12px',
            border: '1px solid #1e283d'
          }}>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>To'g'ri Javoblar</div>
            <div style={{ fontSize: '18px', fontWeight: '900', color: '#10b981', marginTop: '2px' }}>
              {userResult?.correctCount || 0} / {totalQuestions} <span style={{ fontSize: '12px', color: '#86efac' }}>({accuracy}%)</span>
            </div>
          </div>

          <div style={{
            background: '#0e1422',
            padding: '12px',
            borderRadius: '12px',
            border: '1px solid #1e283d'
          }}>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Mukofot</div>
            <div style={{ fontSize: '15px', fontWeight: '900', color: '#fbbf24', marginTop: '2px' }}>
              ⚡ +{userResult?.currentScore || 0} XP • 🪙 +{myRank === 1 ? 50 : 20}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '12px',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => {
            soundManager.playClick();
            onPlayAgain();
          }}
          className="btn-solid-primary"
          style={{ padding: '12px 24px', fontSize: '14px', borderRadius: '12px' }}
        >
          <RotateCcw size={16} />
          <span>Qayta O'ynash</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            onGoExplore();
          }}
          className="btn-solid-blue"
          style={{ padding: '12px 24px', fontSize: '14px', borderRadius: '12px' }}
        >
          <Gamepad2 size={16} />
          <span>Boshqa O'yin Tanlash</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            onGoHome();
          }}
          className="btn-solid-secondary"
          style={{ padding: '12px 20px', fontSize: '14px', borderRadius: '12px' }}
        >
          <Home size={16} />
          <span>Bosh Sahifa</span>
        </button>
      </div>
    </div>
  );
}
