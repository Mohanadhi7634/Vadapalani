const axios = require('axios');

const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;

// Track which chunk each user is on
const userProgress = {};

async function sendMessage(data) {
  const url = `https://graph.facebook.com/v15.0/${PHONE_NUMBER_ID}/messages`;
  try {
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

// Send a normal text message
async function sendText(to, text) {
  return sendMessage({
    messaging_product: 'whatsapp',
    to,
    type: 'text',
    text: { body: text }
  });
}

// Send menu buttons
async function sendMenuButtons(to) {
  return sendMessage({
    messaging_product: 'whatsapp',
    recipient_type: "individual",
    to,
    type: 'interactive',
    interactive: {
      type: 'button',
      body: { text: 'வடபழநி கோயில் தங்களை வரவேற்கிறோம். தேர்வு செய்யவும்:' },
      action: {
        buttons: [
          { type: 'reply', reply: { id: 'TALAVARALAR', title: '1. தலவரலாறு' } },
          { type: 'reply', reply: { id: 'POOJA', title: '2. பூஜை விபரம்' } },
          { type: 'reply', reply: { id: 'KATTANAM', title: '3. கட்டண தரிசனம்' } }
        ]
      }
    }
  });
}

// Send long text in chunks with "More" button
async function sendPaginatedText(to, text, userId) {
  const chunkSize = 4000; // WhatsApp max ~4096
  const chunks = [];

  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }

  let index = userProgress[userId] || 0;
  const chunk = chunks[index];

  const buttons = index < chunks.length - 1
    ? [{ type: 'reply', reply: { id: 'MORE', title: 'More' } }]
    : [];

  await sendMessage({
    messaging_product: 'whatsapp',
    to,
    type: 'interactive',
    interactive: {
      type: 'button',
      body: { text: chunk },
      action: { buttons }
    }
  });

  // Update progress
  if (index < chunks.length - 1) userProgress[userId] = index + 1;
  else delete userProgress[userId];
}

module.exports = { sendText, sendMenuButtons, sendPaginatedText, userProgress };
