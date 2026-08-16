import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN || '8953428165:AAHZeAOhRq0Y7nL6D9Fqg80T1KznaY5WwOM';
const botUsername = process.env.TELEGRAM_BOT_USERNAME || 'kahoooooooot_bot';

// Temporary in-memory code store (code -> { telegramId, username, firstName, createdAt, expiresAt })
const verificationCodes = new Map();

// Helper to generate 5-digit code
export function generate5DigitCode() {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

let bot = null;

try {
  bot = new TelegramBot(token, { polling: true });

  // Handle polling errors safely so server never crashes
  bot.on('polling_error', (error) => {
    console.warn('[Telegram Bot Warning]:', error.message || error);
  });

  // /start or /code command
  bot.onText(/\/start|\/login|\/code/, (msg) => {
    const chatId = msg.chat.id;
    const firstName = msg.from.first_name || 'Bilimdon';
    const username = msg.from.username ? `@${msg.from.username}` : firstName;

    // Generate 5-digit code
    const code = generate5DigitCode();
    const now = Date.now();
    const expiresAt = now + 10 * 60 * 1000; // 10 minutes

    verificationCodes.set(code, {
      telegramId: chatId,
      username: username,
      firstName: firstName,
      createdAt: now,
      expiresAt: expiresAt
    });

    // Cleanup expired codes
    for (const [k, v] of verificationCodes.entries()) {
      if (v.expiresAt < now) {
        verificationCodes.delete(k);
      }
    }

    const welcomeMsg = 
`⚡ *KAHOTBEK PLATFORMASIGA XUSH KELIBSIZ!* ⚡

Salom, *${firstName}*! Siz o'yinlar va viktorinalar maydoniga kirish uchun so'rov yubordingiz.

🔐 *Sizning 5 xonali tasdiqlash kodingiz:*
👉 \`${code}\` 👈

🌐 Ushbu kodni saytga (*Kahotbek*) kiriting va hisobingiz bilan o'yinlarga qo'shiling!
⏱ _Kod 10 daqiqa davomida amal qiladi._`;

    bot.sendMessage(chatId, welcomeMsg, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: "🎮 Saytga O'tish", url: "https://kahoooooooot-bot.render.com" }
          ]
        ]
      }
    }).catch(err => console.error("Error sending bot message:", err));
  });

  // Echo any text message with a code reminder
  bot.on('message', (msg) => {
    if (msg.text && !msg.text.startsWith('/')) {
      const chatId = msg.chat.id;
      bot.sendMessage(chatId, "🔐 Kirish kodi olish uchun /start buyrug'ini bosing!");
    }
  });

  console.log(`[Telegram Bot] @${botUsername} successfully started listening for authentication codes!`);
} catch (e) {
  console.warn('[Telegram Bot init error]:', e);
}

// Function to verify 5 digit code from REST API
export function verifyTelegramCode(code) {
  const cleanCode = String(code).trim();
  const data = verificationCodes.get(cleanCode);

  if (!data) {
    return { success: false, message: "Kod noto'g'ri yoki muddati tugagan! @kahoooooooot_bot ga /start yuboring." };
  }

  if (Date.now() > data.expiresAt) {
    verificationCodes.delete(cleanCode);
    return { success: false, message: "Kodning amal qilish muddati tugagan. Qaytadan /start bosing." };
  }

  // Consume code (one-time use)
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

export function sendTelegramGameNotification(telegramId, text) {
  if (bot && telegramId) {
    bot.sendMessage(telegramId, text, { parse_mode: 'Markdown' }).catch(err => console.warn(err));
  }
}
