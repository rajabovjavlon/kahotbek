// Default rich collection of quizzes for Kahotbek in Uzbek language

export const DEFAULT_QUIZZES = [
  {
    id: "quiz-it-js",
    title: "JavaScript & Zamonaviy Web Dasturlash",
    description: "Frontend dasturchilar uchun JavaScript, React, TypeScript va zamonaviy web texnologiyalari bo'yicha qizg'in intellektual jang!",
    category: "Dasturlash",
    categoryColor: "#3b82f6",
    difficulty: "O'rta",
    playsCount: 0,
    rating: 5.0,
    author: "Javlonbek Dev",
    authorAvatar: "⚡",
    coverGradient: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)",
    icon: "💻",
    questions: [
      {
        id: "js1",
        question: "JavaScriptda `typeof null` natijasi nima chiqadi?",
        timeLimit: 15,
        points: 1000,
        type: "multiple",
        explanation: "Bu JavaScriptning tarixiy xatolaridan (legacy bug) biri bo'lib, `null` ning turi 'object' deb qaytadi.",
        options: [
          { text: "'null'", isCorrect: false, color: "#ef4444", shape: "triangle" },
          { text: "'undefined'", isCorrect: false, color: "#3b82f6", shape: "diamond" },
          { text: "'object'", isCorrect: true, color: "#eab308", shape: "circle" },
          { text: "'boolean'", isCorrect: false, color: "#22c55e", shape: "square" }
        ]
      },
      {
        id: "js2",
        question: "Reactda komponent holatini saqlash uchun qaysi asosiy Hook ishlatiladi?",
        timeLimit: 15,
        points: 1000,
        type: "multiple",
        explanation: "`useState` funktsional komponentlarda holat (state) yaratish va boshqarish uchun asosiy hook hisoblanadi.",
        options: [
          { text: "useEffect", isCorrect: false, color: "#ef4444", shape: "triangle" },
          { text: "useState", isCorrect: true, color: "#3b82f6", shape: "diamond" },
          { text: "useContext", isCorrect: false, color: "#eab308", shape: "circle" },
          { text: "useMemo", isCorrect: false, color: "#22c55e", shape: "square" }
        ]
      },
      {
        id: "js3",
        question: "JavaScriptda `['10', '10', '10'].map(parseInt)` natijasi nima bo'ladi?",
        timeLimit: 20,
        points: 1500,
        type: "multiple",
        explanation: "parseInt(val, index) chaqiriladi: parseInt('10',0)=10, parseInt('10',1)=NaN, parseInt('10',2)=2. Natija: [10, NaN, 2].",
        options: [
          { text: "[10, 10, 10]", isCorrect: false, color: "#ef4444", shape: "triangle" },
          { text: "[10, NaN, 2]", isCorrect: true, color: "#3b82f6", shape: "diamond" },
          { text: "[NaN, NaN, NaN]", isCorrect: false, color: "#eab308", shape: "circle" },
          { text: "TypeError xatoligi", isCorrect: false, color: "#22c55e", shape: "square" }
        ]
      },
      {
        id: "js4",
        question: "`const` bilan e'lon qilingan massivga yangi element qo'shish mumkinmi?",
        timeLimit: 15,
        points: 1000,
        type: "boolean",
        explanation: "Ha, chunki `const` o'zgaruvchi havolasini o'zgartirishni taqiqlaydi, lekin massiv ichidagi elementlarni modifikatsiya qilish mumkin.",
        options: [
          { text: "HA (Mumkin)", isCorrect: true, color: "#22c55e", shape: "square" },
          { text: "YO'Q (Xato beradi)", isCorrect: false, color: "#ef4444", shape: "triangle" }
        ]
      },
      {
        id: "js5",
        question: "CSS Grid va Flexbox o'rtasidagi asosiy farq nimada?",
        timeLimit: 20,
        points: 1000,
        type: "multiple",
        explanation: "Flexbox 1 o'lchovli (qator yoki ustun), CSS Grid esa 2 o'lchovli (qator va ustunlar birga) tartiblash uchun mo'ljallangan.",
        options: [
          { text: "Flexbox 1 o'lchovli, Grid esa 2 o'lchovli", isCorrect: true, color: "#ef4444", shape: "triangle" },
          { text: "Grid faqat mobil uchun ishlaydi", isCorrect: false, color: "#3b82f6", shape: "diamond" },
          { text: "Flexbox eskirgan, faqat Grid ishlatiladi", isCorrect: false, color: "#eab308", shape: "circle" },
          { text: "Hech qanday farqi yo'q", isCorrect: false, color: "#22c55e", shape: "square" }
        ]
      },
      {
        id: "js6",
        question: "JavaScriptda `==` va `===` operatorlari o'rtasidagi asosiy farq nima?",
        timeLimit: 15,
        points: 1000,
        type: "multiple",
        explanation: "`==` faqat qiymatni tekshiradi va type coercion qiladi, `===` esa qiymat bilan birga ma'lumot turini (type) ham qat'iy tekshiradi.",
        options: [
          { text: "Farqi yo'q", isCorrect: false, color: "#ef4444", shape: "triangle" },
          { text: "`===` qiymat va ma'lumot turini qat'iy tekshiradi", isCorrect: true, color: "#3b82f6", shape: "diamond" },
          { text: "`==` tezroq ishlaydi", isCorrect: false, color: "#eab308", shape: "circle" },
          { text: "`===` faqat sonlarni tekshiradi", isCorrect: false, color: "#22c55e", shape: "square" }
        ]
      },
      {
        id: "js7",
        question: "Event Loop (Hodisalar tsikli)da qaysi navbat birinchi bajariladi: Microtask yoki Macrotask?",
        timeLimit: 20,
        points: 1500,
        type: "multiple",
        explanation: "Microtasklar (masalan, Promise.then, queueMicrotask) Macrotasklardan (setTimeout, setInterval) oldin bajariladi.",
        options: [
          { text: "Microtask (Promise)", isCorrect: true, color: "#22c55e", shape: "square" },
          { text: "Macrotask (setTimeout)", isCorrect: false, color: "#ef4444", shape: "triangle" },
          { text: "Ikkalasi bir vaqtda", isCorrect: false, color: "#eab308", shape: "circle" },
          { text: "Tasodifiy", isCorrect: false, color: "#3b82f6", shape: "diamond" }
        ]
      },
      {
        id: "js8",
        question: "TypeScriptda `any` va `unknown` tiplari o'rtasidagi farq nimada?",
        timeLimit: 20,
        points: 1500,
        type: "multiple",
        explanation: "`unknown` turi `any` ga qaraganda xavfsizroq bo'lib, uning ustida amal bajarishdan oldin turini tekshirish (type check) talab etiladi.",
        options: [
          { text: "`unknown` turini tekshirishni talab qiladi (xavfsizroq)", isCorrect: true, color: "#3b82f6", shape: "diamond" },
          { text: "`any` xavfsizroq", isCorrect: false, color: "#ef4444", shape: "triangle" },
          { text: "Hech qanday farqi yo'q", isCorrect: false, color: "#eab308", shape: "circle" },
          { text: "`unknown` faqat string qabul qiladi", isCorrect: false, color: "#22c55e", shape: "square" }
        ]
      },
      {
        id: "js9",
        question: "JavaScriptda `0.1 + 0.2 === 0.3` ifodasi nima qaytaradi?",
        timeLimit: 15,
        points: 1000,
        type: "multiple",
        explanation: "IEEE 754 suzuvchi nuqta standarti tufayli `0.1 + 0.2 = 0.30000000000000004` bo'ladi, natijada `false` qaytadi.",
        options: [
          { text: "true", isCorrect: false, color: "#22c55e", shape: "square" },
          { text: "false", isCorrect: true, color: "#ef4444", shape: "triangle" },
          { text: "undefined", isCorrect: false, color: "#eab308", shape: "circle" },
          { text: "NaN", isCorrect: false, color: "#3b82f6", shape: "diamond" }
        ]
      },
      {
        id: "js10",
        question: "Reactda komponent qayta chizilishini (re-render) oldini olish uchun qaysi HOC ishlatiladi?",
        timeLimit: 15,
        points: 1000,
        type: "multiple",
        explanation: "`React.memo` prop'lar o'zgarmagan holatda komponentni keraksiz qayta render bo'lishidan saqlaydi.",
        options: [
          { text: "React.memo", isCorrect: true, color: "#22c55e", shape: "square" },
          { text: "React.lazy", isCorrect: false, color: "#ef4444", shape: "triangle" },
          { text: "React.useState", isCorrect: false, color: "#3b82f6", shape: "diamond" },
          { text: "React.Fragment", isCorrect: false, color: "#eab308", shape: "circle" }
        ]
      }
    ]
  },
  {
    id: "quiz-ai-tech",
    title: "Sun'iy Intellekt & Kelajak Texnologiyalari",
    description: "LLM modellar, neyron tarmoqlar, robototexnika va Sun'iy Intellekt olamidagi eng qiziqarli savollar!",
    category: "Sun'iy Intellekt",
    categoryColor: "#8b5cf6",
    difficulty: "O'rta",
    playsCount: 0,
    rating: 5.0,
    author: "AI Master",
    authorAvatar: "🤖",
    coverGradient: "linear-gradient(135deg, #3b0764 0%, #581c87 50%, #7e22ce 100%)",
    icon: "🧠",
    questions: [
      {
        id: "ai1",
        question: "GPT qisqartmasi nimani anglatadi?",
        timeLimit: 15,
        points: 1000,
        type: "multiple",
        explanation: "GPT - Generative Pre-trained Transformer so'zlarining qisqartmasi.",
        options: [
          { text: "General Purpose Technology", isCorrect: false, color: "#ef4444", shape: "triangle" },
          { text: "Generative Pre-trained Transformer", isCorrect: true, color: "#3b82f6", shape: "diamond" },
          { text: "Global Programming Tool", isCorrect: false, color: "#eab308", shape: "circle" },
          { text: "Graph Processing Type", isCorrect: false, color: "#22c55e", shape: "square" }
        ]
      },
      {
        id: "ai2",
        question: "Neyron tarmoqlarning asosiy 'o'rganish' algoritmi qanday nomlanadi?",
        timeLimit: 15,
        points: 1000,
        type: "multiple",
        explanation: "Backpropagation (Xatoni orqaga tarqatish) neyron tarmoqlarning og'irliklarini yangilashning asosiy algoritmidir.",
        options: [
          { text: "QuickSort", isCorrect: false, color: "#ef4444", shape: "triangle" },
          { text: "Backpropagation", isCorrect: true, color: "#3b82f6", shape: "diamond" },
          { text: "Dijkstra", isCorrect: false, color: "#eab308", shape: "circle" },
          { text: "Bubble Sort", isCorrect: false, color: "#22c55e", shape: "square" }
        ]
      },
      {
        id: "ai3",
        question: "Tyuring testi (Turing Test) nima uchun xizmat qiladi?",
        timeLimit: 15,
        points: 1000,
        type: "multiple",
        explanation: "Tyuring testi mashinaning inson kabi fikrlash va muloqot qilish qobiliyatini aniqlash uchun qo'llaniladi.",
        options: [
          { text: "Internet tezligini o'lchash", isCorrect: false, color: "#ef4444", shape: "triangle" },
          { text: "Mashinaning insondek fikrlashini sinash", isCorrect: true, color: "#3b82f6", shape: "diamond" },
          { text: "Dasturdagi xatolarni topish", isCorrect: false, color: "#eab308", shape: "circle" },
          { text: "Xotira hajmini aniqlash", isCorrect: false, color: "#22c55e", shape: "square" }
        ]
      },
      {
        id: "ai4",
        question: "Deep Learning qaysi sohaning chuqurlashtirilgan tarmog'i hisoblanadi?",
        timeLimit: 15,
        points: 1000,
        type: "multiple",
        explanation: "Deep Learning bu Machine Learning (Mashinaviy O'rganish)ning ko'p qatlamli neyron tarmoqlarga asoslangan bo'limi.",
        options: [
          { text: "Web dizayn", isCorrect: false, color: "#ef4444", shape: "triangle" },
          { text: "Machine Learning (Mashinaviy O'rganish)", isCorrect: true, color: "#22c55e", shape: "square" },
          { text: "SQL Database", isCorrect: false, color: "#eab308", shape: "circle" },
          { text: "Blokcheyn", isCorrect: false, color: "#3b82f6", shape: "diamond" }
        ]
      },
      {
        id: "ai5",
        question: "Sun'iy intellektda 'Hallucination' (Gallyutsinatsiya) nima?",
        timeLimit: 20,
        points: 1000,
        type: "multiple",
        explanation: "AI model o'zidan ishonarli ko'ringan lekin mutlaqo noto'g'ri faktlarni to'qib chiqarishi gallyutsinatsiya deb ataladi.",
        options: [
          { text: "Modelning noto'g'ri faktlarni to'qib chiqarishi", isCorrect: true, color: "#ef4444", shape: "triangle" },
          { text: "Kompyuterning qizib ketishi", isCorrect: false, color: "#3b82f6", shape: "diamond" },
          { text: "Rasm chizish rejimi", isCorrect: false, color: "#eab308", shape: "circle" },
          { text: "Xavfsizlik protokoli", isCorrect: false, color: "#22c55e", shape: "square" }
        ]
      },
      {
        id: "ai6",
        question: "Transformer arxitekturasining asosiy mexanizmi qaysi?",
        timeLimit: 20,
        points: 1500,
        type: "multiple",
        explanation: "'Self-Attention' mexanizmi Transformer modellariga so'zlar orasidagi bog'liqlikni chuqur tushunish imkonini beradi.",
        options: [
          { text: "Self-Attention (O'z-o'ziga e'tibor)", isCorrect: true, color: "#22c55e", shape: "square" },
          { text: "Binary Search", isCorrect: false, color: "#ef4444", shape: "triangle" },
          { text: "Recursion", isCorrect: false, color: "#3b82f6", shape: "diamond" },
          { text: "Hash Table", isCorrect: false, color: "#eab308", shape: "circle" }
        ]
      }
    ]
  },
  {
    id: "quiz-uzb-history",
    title: "O'zbekiston Tarixi va Buyuk Allomalar",
    description: "Amir Temur, Al-Xorazmiy, Ibn Sino, Mirzo Ulug'bek va boy tariximiz bo'yicha qiziqarli testlar!",
    category: "Tarix",
    categoryColor: "#10b981",
    difficulty: "Oson",
    playsCount: 0,
    rating: 5.0,
    author: "Zukko Tarixchi",
    authorAvatar: "🏛️",
    coverGradient: "linear-gradient(135deg, #064e3b 0%, #047857 50%, #059669 100%)",
    icon: "🕌",
    questions: [
      {
        id: "uz1",
        question: "Amir Temurning davlat shiori qanday bo'lgan?",
        timeLimit: 15,
        points: 1000,
        type: "multiple",
        explanation: "Sohibqiron Amir Temurning davlat muhri va asosiy shiori 'Kuch — adolatdadir' ('Rosti rusti') bo'lgan.",
        options: [
          { text: "Kuch — boylikda", isCorrect: false, color: "#ef4444", shape: "triangle" },
          { text: "Kuch — adolatdadir", isCorrect: true, color: "#22c55e", shape: "square" },
          { text: "Tinchlik va taraqqiyot", isCorrect: false, color: "#eab308", shape: "circle" },
          { text: "G'alaba biz tomonda", isCorrect: false, color: "#3b82f6", shape: "diamond" }
        ]
      },
      {
        id: "uz2",
        question: "Algebra faniga asos solgan vatandosh allomamiz kim?",
        timeLimit: 15,
        points: 1000,
        type: "multiple",
        explanation: "Muhammad ibn Muso al-Xorazmiy 'Al-Jabr' asari bilan matematika va algebra faniga asos solgan.",
        options: [
          { text: "Abu Ali ibn Sino", isCorrect: false, color: "#ef4444", shape: "triangle" },
          { text: "Al-Xorazmiy", isCorrect: true, color: "#3b82f6", shape: "diamond" },
          { text: "Abu Rayhon Beruniy", isCorrect: false, color: "#eab308", shape: "circle" },
          { text: "Mirzo Ulug'bek", isCorrect: false, color: "#22c55e", shape: "square" }
        ]
      },
      {
        id: "uz3",
        question: "Samarqanddagi mashhur Registon maydonida nechta madrasa joylashgan?",
        timeLimit: 15,
        points: 1000,
        type: "multiple",
        explanation: "Registon maydonida 3 ta mahobatli madrasa bor: Ulug'bek, Sherdor va Tillakori madrasalari.",
        options: [
          { text: "2 ta", isCorrect: false, color: "#ef4444", shape: "triangle" },
          { text: "3 ta", isCorrect: true, color: "#eab308", shape: "circle" },
          { text: "4 ta", isCorrect: false, color: "#3b82f6", shape: "diamond" },
          { text: "5 ta", isCorrect: false, color: "#22c55e", shape: "square" }
        ]
      },
      {
        id: "uz4",
        question: "Ibn Sinoning butun dunyoga mashhur tibbiyot ensiklopediyasi nomi nima?",
        timeLimit: 15,
        points: 1000,
        type: "multiple",
        explanation: "Ibn Sino 'Tib qonunlari' (Al-Qonun fit-Tibb) asari bilan dunyo tibbiyotiga 600 yil davomida darslik yaratgan.",
        options: [
          { text: "Ziji Jadidi Ko'ragoniy", isCorrect: false, color: "#ef4444", shape: "triangle" },
          { text: "Tib qonunlari", isCorrect: true, color: "#22c55e", shape: "square" },
          { text: "Qutadg'u bilig", isCorrect: false, color: "#3b82f6", shape: "diamond" },
          { text: "Boburnoma", isCorrect: false, color: "#eab308", shape: "circle" }
        ]
      },
      {
        id: "uz5",
        question: "1018 ta yulduzning jadvalini (Zij) tuzgan buyuk astronom kim?",
        timeLimit: 15,
        points: 1000,
        type: "multiple",
        explanation: "Mirzo Ulug'bek Samarqand rasadxonasida 'Ziji Jadidi Ko'ragoniy' yulduzlar jadvalini yaratgan.",
        options: [
          { text: "Mirzo Ulug'bek", isCorrect: true, color: "#3b82f6", shape: "diamond" },
          { text: "Al-Farg'oniy", isCorrect: false, color: "#ef4444", shape: "triangle" },
          { text: "Imom Buxoriy", isCorrect: false, color: "#eab308", shape: "circle" },
          { text: "Alisher Navoiy", isCorrect: false, color: "#22c55e", shape: "square" }
        ]
      },
      {
        id: "uz6",
        question: "Turkiy tilda ilk bor 'Xamsa' (Besh doston) yaratgan buyuk shoir kim?",
        timeLimit: 15,
        points: 1000,
        type: "multiple",
        explanation: "Alisher Navoiy 1483-1485 yillarda turkiy tilda birinchi bo'lib mashhur 'Xamsa'ni yozgan.",
        options: [
          { text: "Zahiriddin Muhammad Bobur", isCorrect: false, color: "#ef4444", shape: "triangle" },
          { text: "Alisher Navoiy", isCorrect: true, color: "#22c55e", shape: "square" },
          { text: "Nizomiy Ganjaviy", isCorrect: false, color: "#3b82f6", shape: "diamond" },
          { text: "Muqimiy", isCorrect: false, color: "#eab308", shape: "circle" }
        ]
      }
    ]
  },
  {
    id: "quiz-logic-math",
    title: "Mantiq & IQ Jumboqlari",
    description: "Tez fikrlash, zakovat va matematik qonuniyatlarni yechish bo'yicha kuch sinashuvi!",
    category: "Mantiq",
    categoryColor: "#f59e0b",
    difficulty: "Qiyin",
    playsCount: 0,
    rating: 5.0,
    author: "IQ Mastermind",
    authorAvatar: "💡",
    coverGradient: "linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)",
    icon: "🧩",
    questions: [
      {
        id: "m1",
        question: "Ketma-ketlikdagi keyingi sonni toping: 2, 4, 8, 16, 32, ?",
        timeLimit: 15,
        points: 1000,
        type: "multiple",
        explanation: "Har bir son 2 ga ko'paytirib borilmoqda: 32 * 2 = 64.",
        options: [
          { text: "48", isCorrect: false, color: "#ef4444", shape: "triangle" },
          { text: "64", isCorrect: true, color: "#22c55e", shape: "square" },
          { text: "56", isCorrect: false, color: "#3b82f6", shape: "diamond" },
          { text: "68", isCorrect: false, color: "#eab308", shape: "circle" }
        ]
      },
      {
        id: "m2",
        question: "Bir shifokor sizga 3 ta tabletka berdi va har yarim soatda bittadan ichishni buyurdi. Tabletkalarni ichish necha soat davom etadi?",
        timeLimit: 20,
        points: 1500,
        type: "multiple",
        explanation: "1-tabletka darhol (0 daqiqada), 2-si 30 daqiqadan so'ng, 3-si 60 daqiqadan (1 soatdan) so'ng ichiladi. Jami 1 soat!",
        options: [
          { text: "1.5 soat", isCorrect: false, color: "#ef4444", shape: "triangle" },
          { text: "1 soat", isCorrect: true, color: "#3b82f6", shape: "diamond" },
          { text: "2 soat", isCorrect: false, color: "#eab308", shape: "circle" },
          { text: "30 daqiqa", isCorrect: false, color: "#22c55e", shape: "square" }
        ]
      },
      {
        id: "m3",
        question: "Agar 5 ta mushuk 5 ta sichqonni 5 daqiqada tutsa, 100 ta mushuk 100 ta sichqonni necha daqiqada tutadi?",
        timeLimit: 20,
        points: 2000,
        type: "multiple",
        explanation: "Bitta mushuk bitta sichqonni tutishi uchun 5 daqiqa ketadi. Demak, 100 ta mushuk 100 ta sichqonni bir vaqtda 5 daqiqada tutadi!",
        options: [
          { text: "100 daqiqa", isCorrect: false, color: "#ef4444", shape: "triangle" },
          { text: "5 daqiqa", isCorrect: true, color: "#22c55e", shape: "square" },
          { text: "20 daqiqa", isCorrect: false, color: "#3b82f6", shape: "diamond" },
          { text: "50 daqiqa", isCorrect: false, color: "#eab308", shape: "circle" }
        ]
      },
      {
        id: "m4",
        question: "Daryodan o'tish: Ota va uning 2 o'g'li bor. Qayiq faqat 1 ta katta odamni yoki 2 ta bolani ko'tara oladi. Ular daryodan necha marta suzib o'tishda o'tishadi?",
        timeLimit: 25,
        points: 1500,
        type: "multiple",
        explanation: "1) 2 bola narigi qirg'oqqa o'tadi. 2) 1 bola qaytadi. 3) Ota o'tadi. 4) 2-bola qaytadi. 5) 2 bola birga o'tadi. Jami 5 ta qatnov!",
        options: [
          { text: "3 marta", isCorrect: false, color: "#ef4444", shape: "triangle" },
          { text: "5 marta", isCorrect: true, color: "#3b82f6", shape: "diamond" },
          { text: "7 marta", isCorrect: false, color: "#eab308", shape: "circle" },
          { text: "4 marta", isCorrect: false, color: "#22c55e", shape: "square" }
        ]
      },
      {
        id: "m5",
        question: "Fibonachchi ketma-ketligida 0, 1, 1, 2, 3, 5, 8, ? dan keyingi son qaysi?",
        timeLimit: 15,
        points: 1000,
        type: "multiple",
        explanation: "Har bir son oldingi ikki sonning yig'indisi: 5 + 8 = 13.",
        options: [
          { text: "11", isCorrect: false, color: "#ef4444", shape: "triangle" },
          { text: "13", isCorrect: true, color: "#22c55e", shape: "square" },
          { text: "15", isCorrect: false, color: "#3b82f6", shape: "diamond" },
          { text: "12", isCorrect: false, color: "#eab308", shape: "circle" }
        ]
      }
    ]
  },
  {
    id: "quiz-english-ielts",
    title: "Ingliz Tili: IELTS Vocabulary & Grammar",
    description: "Ingliz tilidagi advanced so'zlar, idiomalar va grammatik qoidalarni tekshiruvchi ajoyib quiz!",
    category: "Ingliz tili",
    categoryColor: "#ec4899",
    difficulty: "O'rta",
    playsCount: 0,
    rating: 5.0,
    author: "Miss Laylo (IELTS 8.5)",
    authorAvatar: "🎓",
    coverGradient: "linear-gradient(135deg, #831843 0%, #be185d 50%, #db2777 100%)",
    icon: "🇬🇧",
    questions: [
      {
        id: "eng1",
        question: "What is the synonym of the word 'METICULOUS'?",
        timeLimit: 15,
        points: 1000,
        type: "multiple",
        explanation: "'Meticulous' means showing great attention to detail; very careful and precise.",
        options: [
          { text: "Careless", isCorrect: false, color: "#ef4444", shape: "triangle" },
          { text: "Careful / Thorough", isCorrect: true, color: "#22c55e", shape: "square" },
          { text: "Aggressive", isCorrect: false, color: "#eab308", shape: "circle" },
          { text: "Lazy", isCorrect: false, color: "#3b82f6", shape: "diamond" }
        ]
      },
      {
        id: "eng2",
        question: "Choose the correct sentence in Subjunctive / Conditional mood:",
        timeLimit: 15,
        points: 1500,
        type: "multiple",
        explanation: "Second conditional: 'If I WERE you, I WOULD study harder'.",
        options: [
          { text: "If I was you, I will study harder.", isCorrect: false, color: "#ef4444", shape: "triangle" },
          { text: "If I were you, I would study harder.", isCorrect: true, color: "#3b82f6", shape: "diamond" },
          { text: "If I am you, I would study harder.", isCorrect: false, color: "#eab308", shape: "circle" },
          { text: "If I be you, I will study harder.", isCorrect: false, color: "#22c55e", shape: "square" }
        ]
      },
      {
        id: "eng3",
        question: "What does the idiom 'Bite the bullet' mean?",
        timeLimit: 15,
        points: 1000,
        type: "multiple",
        explanation: "'Bite the bullet' means to face a difficult situation with courage.",
        options: [
          { text: "Ovqat yeyish", isCorrect: false, color: "#ef4444", shape: "triangle" },
          { text: "Qiyin vaziyatga mardona duch kelish / bardosh berish", isCorrect: true, color: "#22c55e", shape: "square" },
          { text: "Qurol ishlatish", isCorrect: false, color: "#eab308", shape: "circle" },
          { text: "Do'stidan xafa bo'lish", isCorrect: false, color: "#3b82f6", shape: "diamond" }
        ]
      },
      {
        id: "eng4",
        question: "Which word means 'ephemeral' (qisqa muddatli / o'tkinchi)?",
        timeLimit: 15,
        points: 1000,
        type: "multiple",
        explanation: "'Ephemeral' means lasting for a very short time (short-lived / temporary).",
        options: [
          { text: "Permanent", isCorrect: false, color: "#ef4444", shape: "triangle" },
          { text: "Short-lived / Temporary", isCorrect: true, color: "#3b82f6", shape: "diamond" },
          { text: "Strong", isCorrect: false, color: "#eab308", shape: "circle" },
          { text: "Dangerous", isCorrect: false, color: "#22c55e", shape: "square" }
        ]
      }
    ]
  },
  {
    id: "quiz-world-football",
    title: "Jahon Futboli & UEFA Chempionlar Ligasi",
    description: "Ronaldo, Messi, Oltin to'p, Chempionlar ligasi va jahon chempionatlari bo'yicha futbol fanatlari musobaqasi!",
    category: "Sport",
    categoryColor: "#14b8a6",
    difficulty: "Oson",
    playsCount: 0,
    rating: 5.0,
    author: "Footy King",
    authorAvatar: "⚽",
    coverGradient: "linear-gradient(135deg, #134e4a 0%, #0f766e 50%, #0d9488 100%)",
    icon: "🏆",
    questions: [
      {
        id: "ft1",
        question: "UEFA Chempionlar Ligasida eng ko'p kubok yutgan klub qaysi?",
        timeLimit: 15,
        points: 1000,
        type: "multiple",
        explanation: "Real Madrid 15 marotaba UEFA Chempionlar Ligasida chempion bo'lgan.",
        options: [
          { text: "FC Barcelona", isCorrect: false, color: "#ef4444", shape: "triangle" },
          { text: "Real Madrid (15 ta)", isCorrect: true, color: "#3b82f6", shape: "diamond" },
          { text: "AC Milan", isCorrect: false, color: "#eab308", shape: "circle" },
          { text: "Bayern Munich", isCorrect: false, color: "#22c55e", shape: "square" }
        ]
      },
      {
        id: "ft2",
        question: "Futbol bo'yicha eng ko'p 'Oltin to'p' (Ballon d'Or) sovrinini kim yutgan?",
        timeLimit: 15,
        points: 1000,
        type: "multiple",
        explanation: "Lionel Messi 8 marotaba 'Oltin to'p' sovrinini qo'lga kiritgan.",
        options: [
          { text: "Cristiano Ronaldo (5 ta)", isCorrect: false, color: "#ef4444", shape: "triangle" },
          { text: "Lionel Messi (8 ta)", isCorrect: true, color: "#22c55e", shape: "square" },
          { text: "Pele", isCorrect: false, color: "#eab308", shape: "circle" },
          { text: "Diego Maradona", isCorrect: false, color: "#3b82f6", shape: "diamond" }
        ]
      },
      {
        id: "ft3",
        question: "2022-yilgi FIFA Jahon Chempionati qaysi davlatda bo'lib o'tdi?",
        timeLimit: 15,
        points: 1000,
        type: "multiple",
        explanation: "2022-yilgi futbol bo'yicha jahon chempionati Qatarda o'tkazildi va Argentina g'olib bo'ldi.",
        options: [
          { text: "Rossiya", isCorrect: false, color: "#ef4444", shape: "triangle" },
          { text: "Qatar", isCorrect: true, color: "#3b82f6", shape: "diamond" },
          { text: "Braziliya", isCorrect: false, color: "#eab308", shape: "circle" },
          { text: "AQSh", isCorrect: false, color: "#22c55e", shape: "square" }
        ]
      },
      {
        id: "ft4",
        question: "Futbol bo'yicha Jahon Chempionatlarida eng ko'p g'olib bo'lgan terma jamoa qaysi?",
        timeLimit: 15,
        points: 1000,
        type: "multiple",
        explanation: "Braziliya terma jamoasi 5 marotaba (1958, 1962, 1970, 1994, 2002) Jahon Chempioni bo'lgan.",
        options: [
          { text: "Germaniya", isCorrect: false, color: "#ef4444", shape: "triangle" },
          { text: "Braziliya (5 marta)", isCorrect: true, color: "#22c55e", shape: "square" },
          { text: "Italiya", isCorrect: false, color: "#3b82f6", shape: "diamond" },
          { text: "Argentina", isCorrect: false, color: "#eab308", shape: "circle" }
        ]
      }
    ]
  },
  {
    id: "quiz-space-science",
    title: "Koinot & Astronomiya Sirlari",
    description: "Qora tuynuklar, sayyoralar, Quyosh tizimi va koinotning cheksiz jumboqlari!",
    category: "Fan",
    categoryColor: "#6366f1",
    difficulty: "O'rta",
    playsCount: 0,
    rating: 5.0,
    author: "Cosmos Voyager",
    authorAvatar: "🚀",
    coverGradient: "linear-gradient(135deg, #1e1b4b 0%, #3730a3 50%, #4f46e5 100%)",
    icon: "🌌",
    questions: [
      {
        id: "sp1",
        question: "Quyosh tizimidagi eng katta sayyora qaysi?",
        timeLimit: 15,
        points: 1000,
        type: "multiple",
        explanation: "Yupiter (Jupiter) Quyosh tizimidagi eng ulkan sayyora hisoblanadi.",
        options: [
          { text: "Mars", isCorrect: false, color: "#ef4444", shape: "triangle" },
          { text: "Yupiter", isCorrect: true, color: "#3b82f6", shape: "diamond" },
          { text: "Saturn", isCorrect: false, color: "#eab308", shape: "circle" },
          { text: "Venera", isCorrect: false, color: "#22c55e", shape: "square" }
        ]
      },
      {
        id: "sp2",
        question: "Yorug'lik tezligi vakuumda sekundiga qancha masofani bosib o'tadi?",
        timeLimit: 15,
        points: 1000,
        type: "multiple",
        explanation: "Yorug'lik tezligi vakuumda taxminan 300,000 km/s (aniqrog'i 299,792,458 m/s).",
        options: [
          { text: "150,000 km/s", isCorrect: false, color: "#ef4444", shape: "triangle" },
          { text: "300,000 km/s", isCorrect: true, color: "#22c55e", shape: "square" },
          { text: "1,000,000 km/s", isCorrect: false, color: "#eab308", shape: "circle" },
          { text: "30,000 km/s", isCorrect: false, color: "#3b82f6", shape: "diamond" }
        ]
      },
      {
        id: "sp3",
        question: "Oyga ilk bor qadami yetgan inson kim?",
        timeLimit: 15,
        points: 1000,
        type: "multiple",
        explanation: "Nil Armstrong (Neil Armstrong) 1969-yil 20-iyulda 'Apollo 11' missiyasida Oyga birinchi bo'lib qadam qo'ygan.",
        options: [
          { text: "Yuriy Gagarin", isCorrect: false, color: "#ef4444", shape: "triangle" },
          { text: "Nil Armstrong", isCorrect: true, color: "#3b82f6", shape: "diamond" },
          { text: "Ilon Mask", isCorrect: false, color: "#eab308", shape: "circle" },
          { text: "Bazz Oldrin", isCorrect: false, color: "#22c55e", shape: "square" }
        ]
      }
    ]
  }
];

export const CATEGORIES = [
  "Barchasi",
  "Dasturlash",
  "Sun'iy Intellekt",
  "Tarix",
  "Mantiq",
  "Ingliz tili",
  "Sport",
  "Fan"
];

// Helper to prepare questions according to host chosen question count (5, 10, 15, 20, 30, 40, 50, etc.)
export function prepareQuizQuestions(quiz, targetCount = 'all', shuffle = true, customTimeLimit = null) {
  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return [];
  }

  // Collect all available questions across all default quizzes for pool fallback
  const globalPool = DEFAULT_QUIZZES.flatMap(q => q.questions || []);
  let pool = [...quiz.questions];

  // If target count is greater than current quiz questions, pull unique questions from global pool
  if (targetCount !== 'all' && typeof targetCount === 'number' && pool.length < targetCount) {
    const existingIds = new Set(pool.map(q => q.id || q.question));
    const extraQuestions = globalPool.filter(q => !existingIds.has(q.id || q.question));
    
    // Shuffle extras and add
    const shuffledExtras = [...extraQuestions].sort(() => 0.5 - Math.random());
    pool = [...pool, ...shuffledExtras];

    // If still less, cycle pool with unique IDs
    while (pool.length < targetCount) {
      const idx = pool.length;
      const baseQ = quiz.questions[idx % quiz.questions.length];
      pool.push({
        ...baseQ,
        id: `${baseQ.id || 'q'}_extra_${idx}`
      });
    }
  }

  let finalQuestions = [...pool];

  // Shuffle if requested
  if (shuffle) {
    finalQuestions = finalQuestions.sort(() => 0.5 - Math.random());
  }

  // Slice to target count
  if (targetCount !== 'all' && typeof targetCount === 'number') {
    finalQuestions = finalQuestions.slice(0, targetCount);
  }

  // Apply custom time limit if set
  if (customTimeLimit && typeof customTimeLimit === 'number') {
    finalQuestions = finalQuestions.map(q => ({
      ...q,
      timeLimit: customTimeLimit
    }));
  }

  return finalQuestions;
}

