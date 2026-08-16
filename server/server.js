import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import { verifyTelegramCode } from './telegramBot.js';
import { setupSocketHandlers } from './socketHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3001;

// 1. SECURITY MIDDLEWARE (HELMET)
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows flexible assets for dev & web sockets
    crossOriginEmbedderPolicy: false
  })
);

// 2. CORS SETTINGS
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// 3. BODY PARSERS & LIMITS (ANTI-DDOS PAYLOAD PROTECTION)
app.use(express.json({ limit: '500kb' }));
app.use(express.urlencoded({ extended: true, limit: '500kb' }));

// 4. RATE LIMITING (ANTI-BRUTE FORCE & DDOS DEFENSE)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 auth requests per windowMs
  message: { success: false, message: "Juda ko'p so'rov yuborildi. Xavfsizlik yuzasidan birozdan so'ng qayta urining." },
  standardHeaders: true,
  legacyHeaders: false,
});

const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 300, // 300 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', generalLimiter);

// 5. SOCKET.IO SETUP WITH ORIGIN & BUFFER PROTECTION
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
  maxHttpBufferSize: 1e5 // 100kb limit to prevent memory exhaustion attacks
});

setupSocketHandlers(io);

// 6. HEALTH CHECK (FOR PRODUCTION MONITORING)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', uptime: process.uptime(), timestamp: new Date() });
});

// 7. TELEGRAM BOT VERIFICATION ENDPOINT
app.post('/api/auth/telegram-verify', authLimiter, (req, res) => {
  try {
    const { code } = req.body;
    if (!code || String(code).trim().length !== 5) {
      return res.status(400).json({ 
        success: false, 
        message: "Iltimos, aynan 5 xonali tasdiqlash parolini kiriting!" 
      });
    }

    const verification = verifyTelegramCode(code);
    if (verification.success) {
      return res.status(200).json({
        success: true,
        message: "Telegram orqali muvaffaqiyatli tasdiqlandi!",
        user: verification.user
      });
    } else {
      return res.status(400).json({
        success: false,
        message: verification.message
      });
    }
  } catch (err) {
    console.error("Auth verification error:", err);
    res.status(500).json({ success: false, message: "Serverda xatolik yuz berdi" });
  }
});

// 8. SERVE PRODUCTION FRONTEND BUILD
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// START SERVER
server.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 KAHOTBEK SERVER IS READY!`);
  console.log(`🌐 Listening on port: ${PORT}`);
  console.log(`🛡️  Security Layers (Helmet & Rate Limiter) ACTIVE`);
  console.log(`🤖 Telegram Bot: @${process.env.TELEGRAM_BOT_USERNAME || 'kahotbekbot'}`);
  console.log(`=========================================`);
});
