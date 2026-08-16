import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Sparkles, 
  Check, 
  Flame, 
  Award
} from 'lucide-react';
import { SHOP_ITEMS } from '../data/shopItems';
import { soundManager } from '../utils/sounds';
import { fireVictoryConfetti } from '../utils/confetti';

export default function ShopView({ user, onUpdateUser }) {
  const [selectedTab, setSelectedTab] = useState('all');
  const [purchaseSuccessMsg, setPurchaseSuccessMsg] = useState('');

  const inventory = user.inventory || ['trail_fire'];
  const equippedTrail = user.equippedTrail || 'trail_fire';
  const equippedTitle = user.equippedTitle || '';

  const filteredItems = SHOP_ITEMS.filter(item => {
    if (selectedTab === 'all') return true;
    return item.type === selectedTab;
  });

  const handleBuyItem = (item) => {
    soundManager.playClick();

    if ((user.coins || 0) < item.price) {
      soundManager.playWrong();
      alert(`Mablag' yetarli emas! Sizda ${user.coins || 0} tanga bor, buyum narxi: ${item.price} tanga.`);
      return;
    }

    const newCoins = (user.coins || 0) - item.price;
    const newInventory = [...inventory, item.id];

    let updatedUserData = {
      ...user,
      coins: newCoins,
      inventory: newInventory
    };

    if (item.type === 'trail') {
      updatedUserData.equippedTrail = item.id;
    } else if (item.type === 'avatar') {
      updatedUserData.avatar = item.emoji;
    } else if (item.type === 'title') {
      updatedUserData.equippedTitle = item.name;
    }

    onUpdateUser(updatedUserData);
    soundManager.playCorrect();
    fireVictoryConfetti();
    setPurchaseSuccessMsg(`"${item.name}" muvaffaqiyatli xarid qilindi va faollashtirildi! 🎉`);
    setTimeout(() => setPurchaseSuccessMsg(''), 3000);
  };

  const handleEquipItem = (item) => {
    soundManager.playClick();
    let updatedUserData = { ...user };

    if (item.type === 'trail') {
      updatedUserData.equippedTrail = item.id;
    } else if (item.type === 'avatar') {
      updatedUserData.avatar = item.emoji;
    } else if (item.type === 'title') {
      updatedUserData.equippedTitle = item.name;
    }

    onUpdateUser(updatedUserData);
    soundManager.playCorrect();
    setPurchaseSuccessMsg(`"${item.name}" tanlandi va faollashtirildi! ✨`);
    setTimeout(() => setPurchaseSuccessMsg(''), 2500);
  };

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '24px 20px 70px' }}>
      <div style={{
        background: '#121826',
        border: '1px solid #1e283d',
        borderRadius: '20px',
        padding: '28px 30px',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              color: '#fff'
            }}>
              🛍️
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#ffffff' }}>
              Kahotbek Do'koni & Effektlar
            </h1>
          </div>
          <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '4px' }}>
            O'yinda yurganingizda orqangizdan chiqadigan maxsus effektlar, afsonaviy avatarlar va unvonlarni tangalarga sotib oling!
          </p>
        </div>

        <div style={{
          background: '#0e1422',
          border: '1px solid #222d42',
          borderRadius: '14px',
          padding: '12px 22px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{ fontSize: '28px' }}>🪙</div>
          <div>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>
              Mavjud Tangalaringiz
            </div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#fbbf24' }}>
              {(user.coins || 0).toLocaleString()} <span style={{ fontSize: '14px' }}>Tanga</span>
            </div>
          </div>
        </div>
      </div>

      {purchaseSuccessMsg && (
        <div className="anim-pop" style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          color: '#86efac',
          padding: '12px 18px',
          borderRadius: '14px',
          marginBottom: '22px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '14px',
          fontWeight: '700'
        }}>
          <Check size={18} color="#10b981" />
          <span>{purchaseSuccessMsg}</span>
        </div>
      )}

      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '26px',
        overflowX: 'auto',
        paddingBottom: '4px'
      }}>
        {[
          { id: 'all', label: 'Barcha Buyumlar (Hammasi)', icon: ShoppingBag },
          { id: 'trail', label: 'Yurish Effektlari (Trails)', icon: Flame },
          { id: 'avatar', label: 'Eksklyuziv Avatarlar', icon: Sparkles },
          { id: 'title', label: 'Unvonlar & Belgilar', icon: Award },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = selectedTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                soundManager.playClick();
                setSelectedTab(tab.id);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 18px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: '700',
                whiteSpace: 'nowrap',
                background: isActive ? '#4f46e5' : '#121826',
                border: isActive ? '1px solid #4f46e5' : '1px solid #1e283d',
                color: isActive ? '#ffffff' : '#94a3b8'
              }}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '18px'
      }}>
        {filteredItems.map(item => {
          const isOwned = inventory.includes(item.id);
          const isEquipped = (item.type === 'trail' && equippedTrail === item.id) ||
                            (item.type === 'avatar' && user.avatar === item.emoji) ||
                            (item.type === 'title' && equippedTitle === item.name);

          const canAfford = (user.coins || 0) >= item.price;

          return (
            <div
              key={item.id}
              style={{
                background: '#121826',
                border: isEquipped ? '2px solid #4f46e5' : '1px solid #1e283d',
                borderRadius: '16px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '800',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: item.type === 'trail' ? 'rgba(239, 68, 68, 0.15)' : (item.type === 'avatar' ? 'rgba(2, 132, 199, 0.15)' : 'rgba(245, 158, 11, 0.15)'),
                  color: item.color || '#38bdf8',
                  border: `1px solid ${item.color || '#38bdf8'}30`
                }}>
                  {item.type === 'trail' ? '⚡ YURISH EFFEKTI' : (item.type === 'avatar' ? '🦁 AVATAR' : '👑 UNVON')}
                </span>

                {isEquipped && (
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '800',
                    color: '#34d399',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Check size={13} /> FAOL
                  </span>
                )}
              </div>

              <div style={{
                textAlign: 'center',
                padding: '16px 0',
                background: '#0e1422',
                borderRadius: '12px',
                marginBottom: '14px',
                border: '1px solid #1e283d'
              }}>
                <div style={{
                  fontSize: '44px',
                  marginBottom: '4px',
                  filter: `drop-shadow(0 0 10px ${item.color || '#4f46e5'}40)`
                }}>
                  {item.icon}
                </div>
                {item.type === 'trail' && (
                  <div style={{ fontSize: '11px', color: item.color, fontWeight: '800' }}>
                    Effekt zarrachasi: {item.particle} {item.particle} {item.particle}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#ffffff', marginBottom: '4px' }}>
                  {item.name}
                </h3>
                <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.4 }}>
                  {item.description}
                </p>
              </div>

              <div>
                {isOwned ? (
                  isEquipped ? (
                    <button
                      disabled
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '10px',
                        background: '#1c273c',
                        border: '1px solid #283652',
                        color: '#34d399',
                        fontSize: '13px',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <Check size={15} />
                      <span>Hozirda Tanlangan</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEquipItem(item)}
                      className="btn-solid-blue"
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '10px',
                        fontSize: '13px'
                      }}
                    >
                      <Sparkles size={15} />
                      <span>Faollashtirish</span>
                    </button>
                  )
                ) : (
                  <button
                    onClick={() => handleBuyItem(item)}
                    disabled={!canAfford}
                    className="btn-solid-primary"
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '10px',
                      fontSize: '13px',
                      opacity: canAfford ? 1 : 0.6
                    }}
                  >
                    <span>🪙 {item.price} Tangaga Sotib Olish</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
