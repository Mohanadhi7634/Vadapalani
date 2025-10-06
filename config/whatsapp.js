const axios = require('axios');

const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;

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

// Regular text
async function sendText(to, text) {
  return sendMessage({
    messaging_product: 'whatsapp',
    to,
    type: 'text',
    text: { body: text }
  });
}

// --- MENU PAGE 1 ---
async function sendMenuPage1(to) {
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
           { type: 'reply', reply: { id: 'KATTANAM', title: '3. கட்டண தரிசனம்' } },
          { type: 'reply', reply: { id: 'NEXT_MENU', title: '👉 மேலும்...' } }
        ]
      }
    }
  });
}

// --- MENU PAGE 2 ---
async function sendMenuPage2(to) {
  return sendMessage({
    messaging_product: 'whatsapp',
    recipient_type: "individual",
    to,
    type: 'interactive',
    interactive: {
      type: 'button',
      body: { text: 'மேலும் விருப்பங்கள்:' },
      action: {
        buttons: [
         
          { type: 'reply', reply: { id: 'MARRIAGE', title: '4. திருமணம் விவரங்கள்' } },
          { type: 'reply', reply: { id: 'BACK_MENU', title: '⬅️ பின்செல்' } }
        ]
      }
    }
  });
}

// Split long text safely
async function sendPaginatedText(to, text) {
  const chunkSize = 3000;
  for (let i = 0; i < text.length; i += chunkSize) {
    await sendText(to, text.slice(i, i + chunkSize));
  }
}

module.exports = { sendText, sendMenuPage1, sendMenuPage2, sendPaginatedText };
