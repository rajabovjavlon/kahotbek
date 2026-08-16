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

// Native Telegram API helper using standard fetch (Zero external dependency bugs!)
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
          const firstName = msg.from.first_name || 'Bilimdon';
          const username = msg.from.username ? `@${msg.from.username}` : firstName;
          const text = msg.text.trim();

          if (text.startsWith('/start') || text.startsWith('/login') || text.startsWith('/code')) {
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

            await callTelegramApi('sendMessage', {
              chat_id: chatId,
              text: welcomeMsg,
              parse_mode: 'Markdown'
            });
          } else {
            await callTelegramApi('sendMessage', {
              chat_id: chatId,
              text: "🔐 Kirish kodi olish uchun /start buyrug'ini bosing!"
            });
          }
        }
      }
    } catch (e) {
      // Wait 3 seconds before retry if network glitch
      await new Promise(r => setTimeout(r, 3000));
    }
  }
}

// Start polling in background if in server environment
if (typeof process !== 'undefined' && process.env) {
  pollTelegramUpdates().catch(e => console.warn(e));
  console.log(`[Telegram Bot] @${botUsername} successfully started listening for authentication codes!`);
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

export async function sendTelegramGameNotification(telegramId, text) {
  if (telegramId && text) {
    await callTelegramApi('sendMessage', {
      chat_id: telegramId,
      text: text,
      parse_mode: 'Markdown'
    });
  }
}
