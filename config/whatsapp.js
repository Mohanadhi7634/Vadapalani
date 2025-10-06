const axios = require('axios');
const allRows = require('../utils/allRows');

const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;

async function sendMessage(data) {
  try {
    const url = `https://graph.facebook.com/v15.0/${PHONE_NUMBER_ID}/messages`;
    const res = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    console.log("✅ Message sent:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Error sending message:", err.response?.data || err.message);
  }
}

async function sendText(to, text) {
  return sendMessage({
    messaging_product: 'whatsapp',
    to,
    type: 'text',
    text: { body: text }
  });
}

async function sendPaginatedText(to, text) {
  const chunkSize = 3000; // safe limit
  for (let i = 0; i < text.length; i += chunkSize) {
    await sendText(to, text.slice(i, i + chunkSize));
  }
}

async function sendMenuList(to) {
  // split rows into chunks of 10 (WhatsApp max)
  const chunks = [];
  for (let i = 0; i < allRows.length; i += 10) {
    chunks.push(allRows.slice(i, i + 10));
  }

  // send each chunk as a separate interactive message
  for (let idx = 0; idx < chunks.length; idx++) {
    await sendMessage({
      messaging_product: 'whatsapp',
      recipient_type: "individual",
      to,
      type: 'interactive',
      interactive: {
        type: 'list',
        body: { text: '🌸 அருள்மிகு வடபழநி கோயில் தங்களை வரவேற்கிறது.\nதேர்வு செய்யவும் 👇' },
        footer: { text: 'விருப்பத்தைத் தேர்வு செய்யுங்கள்.' },
        action: {
          button: '📜 மெனு திறக்க',
          sections: [
            {
              title: `கோவில் பாகம் ${idx + 1}`, // ≤24 chars
              rows: chunks[idx]
            }
          ]
        }
      }
    });
  }
}

module.exports = { sendText, sendPaginatedText, sendMenuList };
