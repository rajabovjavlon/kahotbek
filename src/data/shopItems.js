export const SHOP_ITEMS = [
  // 1. TRAIL EFFECTS (O'yinda yurganida orqasida chiqadigan maxsus effektlar)
  {
    id: 'trail_fire',
    type: 'trail',
    name: 'Olovli Iz (Fire Burst)',
    description: 'Har qadamda orqangizdan qizil olov va alangali uchqunlar qoladi',
    price: 150,
    icon: '🔥',
    cssClass: 'trail-fire',
    color: '#ef4444',
    particle: '🔥'
  },
  {
    id: 'trail_lightning',
    type: 'trail',
    name: 'Kiber Chaqmoq (Lightning)',
    description: 'Yugurganingizda neon ko\'k elektr energiyasi va chaqmoqlar chaqnaydi',
    price: 250,
    icon: '⚡',
    cssClass: 'trail-lightning',
    color: '#0284c7',
    particle: '⚡'
  },
  {
    id: 'trail_stars',
    type: 'trail',
    name: 'Koinot Yulduzlari (Stardust)',
    description: 'Sehrli porlovchi oltin yulduzlar va koinot changi',
    price: 300,
    icon: '✨',
    cssClass: 'trail-stars',
    color: '#fbbf24',
    particle: '⭐'
  },
  {
    id: 'trail_frost',
    type: 'trail',
    name: 'Muzli Blizzard (Ice Frost)',
    description: 'Muzlagan qor uchqunlari va billur muz izi',
    price: 200,
    icon: '❄️',
    cssClass: 'trail-frost',
    color: '#38bdf8',
    particle: '❄️'
  },
  {
    id: 'trail_gold',
    type: 'trail',
    name: 'Oltin Tangalar (Coin Rain)',
    description: 'Har bir to\'g\'ri javobda orqangizdan oltin tangalar yog\'iladi',
    price: 450,
    icon: '🪙',
    cssClass: 'trail-gold',
    color: '#f59e0b',
    particle: '🪙'
  },
  {
    id: 'trail_emerald',
    type: 'trail',
    name: 'Zumrad Energiya (Emerald)',
    description: 'Yashil yaltiragan tabiat energiyasi va zumrad zarrachalari',
    price: 180,
    icon: '💎',
    cssClass: 'trail-emerald',
    color: '#10b981',
    particle: '💎'
  },

  // 2. UNIKAL AVATARLAR (Eksklyuziv personajlar)
  {
    id: 'avatar_phoenix',
    type: 'avatar',
    name: 'Olovli Feniks',
    description: 'Afsonaviy qayta tug\'iluvchi olov qushi',
    price: 350,
    icon: '🦅',
    emoji: '🦅',
    badge: 'Afsona',
    color: '#ef4444'
  },
  {
    id: 'avatar_cyber_dragon',
    type: 'avatar',
    name: 'Kiber Ajdaho',
    description: 'Kiber makonning eng kuchli jonzoti',
    price: 500,
    icon: '🐉',
    emoji: '🐉',
    badge: 'Master',
    color: '#8b5cf6'
  },
  {
    id: 'avatar_gold_lion',
    type: 'avatar',
    name: 'Oltin Sher',
    description: 'Viktorinalar maydonining haqiqiy qiroli',
    price: 400,
    icon: '🦁',
    emoji: '🦁',
    badge: 'Qirol',
    color: '#f59e0b'
  },
  {
    id: 'avatar_alien',
    type: 'avatar',
    name: 'Koinot Dahosi',
    description: 'Boshqa galaktikadan kelgan intellektual',
    price: 320,
    icon: '👽',
    emoji: '👽',
    badge: 'Kosmik',
    color: '#10b981'
  },
  {
    id: 'avatar_ninja_tiger',
    type: 'avatar',
    name: 'Ninja Yo\'lbars',
    description: 'Tezkor fikrlovchi yirtqich jangchi',
    price: 280,
    icon: '🐯',
    emoji: '🐯',
    badge: 'Epchil',
    color: '#ea580c'
  },

  // 3. UNVONLAR VA MAXSUS BELGILAR (Titles & Badges)
  {
    id: 'title_champion',
    type: 'title',
    name: '🏆 Turnir Chempioni',
    description: 'Ismingiz yonida oltin kubok va chempionlik belgisi yonib turadi',
    price: 600,
    icon: '👑',
    tag: 'CHAMPION',
    color: '#fbbf24'
  },
  {
    id: 'title_grandmaster',
    type: 'title',
    name: '🎖️ Grossmeyster',
    description: 'Eng tajribali va kuchli bilimdonlar nishoni',
    price: 450,
    icon: '🎖️',
    tag: 'GRANDMASTER',
    color: '#818cf8'
  },
  {
    id: 'title_speed',
    type: 'title',
    name: '⚡ Shiddat Ustasi',
    description: 'Savollarga eng tez javob beruvchi chaqqon o\'yinchi',
    price: 350,
    icon: '⚡',
    tag: 'SPEED_DEV',
    color: '#38bdf8'
  }
];
