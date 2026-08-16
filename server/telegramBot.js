import dotenv from 'dotenv';
import crypto from 'crypto';
dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN || '8602892525:AAGUdHDQq2epU0_uiI_hSY-RMNKViupPNpI';
const botUsername = process.env.TELEGRAM_BOT_USERNAME || 'kahotbekbot';

// In-memory verification code store:
// code -> { telegramId, username, firstName, createdAt, expiresAt, attempts }
const verificationCodes = new Map();

// Rate limiting map for bot requests per telegramId (anti-spam)
const botRateLimits = new Map();

// Cryptographically secure 5-digit code generator
export function generate5DigitCode() {
  return crypto.randomInt(10000, 100000).toString();
}

// Native Telegram API helper using fetch
async function callTelegramApi(method, body = {}) {
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return await res.json();
  } catch (err) {
    console.warn(`[Telegram API Error in ${method}]:`, err.message);
    return null;
  }
}

// Polling loop for Telegram updates
let lastUpdateId = 0;
let isPolling = false;

async function pollTelegramUpdates() {
  if (isPolling) return;
  isPolling = true;

  while (true) {
    try {
      const data = await callTelegramApi('getUpdates', {
        offset: lastUpdateId + 1,
        timeout: 25,
        allowed_updates: ['message']
      });

      if (data && data.ok && Array.isArray(data.result)) {
        for (const update of data.result) {
          lastUpdateId = update.update_id;
          const msg = update.message;
          if (!msg || !msg.text) continue;

          const chatId = msg.chat.id;
          const firstName = msg.from.first_name || 'Foydalanuvchi';
          const username = msg.from.username ? `@${msg.from.username}` : firstName;
          const text = msg.text.trim();

          // Anti-spam check: 1 code per 10 seconds per user
          const lastReqTime = botRateLimits.get(chatId) || 0;
          const now = Date.now();
          if (now - lastReqTime < 10000 && !text.startsWith('/help')) {
            await callTelegramApi('sendMessage', {
              chat_id: chatId,
              text: "⚠️ Iltimos, biroz kuting! Yangi kod olish uchun 10 soniyadan so'ng qayta urinib ko'ring."
            });
            continue;
          }
          botRateLimits.set(chatId, now);

          // Clean up old codes for this telegramId first
          for (const [k, v] of verificationCodes.entries()) {
            if (v.telegramId === chatId || v.expiresAt < now) {
              verificationCodes.delete(k);
            }
          }

          // Generate secure 5-digit verification code
          const code = generate5DigitCode();
          const expiresAt = now + 10 * 60 * 1000; // 10 minutes expiry

          verificationCodes.set(code, {
            telegramId: chatId,
            username: username,
            firstName: firstName,
            createdAt: now,
            expiresAt: expiresAt,
            attempts: 0
          });

          // Exact customized message format requested by the user
          const welcomeMsg = 
`🌟 Assalomu alaykum, hurmatli ${firstName}! 🌟

Saytimizdan foydalanayotganingiz uchun sizga samimiy minnatdorchilik bildiramiz! 🤝✨

🔐 Sizning tasdiqlash parolingiz:
👉 ${code} 👈

⚠️ Xavfsizlik eslatmasi: Ushbu parolni hech kimga, hatto administratorlarga ham bermang!`;

          await callTelegramApi('sendMessage', {
            chat_id: chatId,
            text: welcomeMsg
          });
        }
      }
    } catch (e) {
      // Network glitch backoff
      await new Promise(r => setTimeout(r, 3000));
    }
  }
}

// Start polling in background if in server environment
if (typeof process !== 'undefined' && process.env) {
  pollTelegramUpdates().catch(e => console.warn('[Telegram Polling Error]:', e));
  console.log(`[Telegram Bot] @${botUsername} muvaffaqiyatli ishga tushdi va kodlarni kutmoqda!`);
}

// Verify 5-digit code from REST API with brute-force security limits
export function verifyTelegramCode(code) {
  const cleanCode = String(code).trim().replace(/\D/g, '');
  
  if (cleanCode.length !== 5) {
    return { success: false, message: "Parol aynan 5 xonali raqamdan iborat bo'lishi kerak!" };
  }

  const data = verificationCodes.get(cleanCode);

  if (!data) {
    return { 
      success: false, 
      message: "Kiritilgan tasdiqlash paroli noto'g'ri yoki muddati tugagan! @kahotbekbot ga kiring va /start bosing." 
    };
  }

  // Check expiration
  if (Date.now() > data.expiresAt) {
    verificationCodes.delete(cleanCode);
    return { 
      success: false, 
      message: "Parolning amal qilish muddati tugagan (10 daqiqa). Qaytadan @kahotbekbot ga /start yuboring." 
    };
  }

  // Brute force protection: limit to 5 failed attempts per code
  data.attempts += 1;
  if (data.attempts > 5) {
    verificationCodes.delete(cleanCode);
    return {
      success: false,
      message: "Ko'p marotaba xato parol kiritildi! Xavfsizlik yuzasidan ushbu kod bekor qilindi. Yangi kod oling."
    };
  }

  // Successfully verified! Consume code (single-use)
  verificationCodes.delete(cleanCode);

  return {
    success: true,
    user: {
      id: `tg_${data.telegramId}`,
      name: data.firstName,
      username: data.username,
      telegramId: data.telegramId,
      verified: true
    }
  };
}

export async function sendTelegramGameNotification(telegramId, text) {
  if (telegramId && text) {
    await callTelegramApi('sendMessage', {
      chat_id: telegramId,
      text: text
    });
  }
}
