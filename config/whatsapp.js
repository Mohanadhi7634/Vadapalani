// config/whatsapp.js
const axios = require('axios');

const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;

// Send message via WhatsApp Cloud API
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

// Regular text message
async function sendText(to, text) {
  return sendMessage({
    messaging_product: 'whatsapp',
    to,
    type: 'text',
    text: { body: text }
  });
}

// Send menu as WhatsApp list
async function sendMenuList(to) {
  return sendMessage({
    messaging_product: 'whatsapp',
    recipient_type: "individual",
    to,
    type: 'interactive',
    interactive: {
      type: 'list',
      body: {
        text: '🌸 வடபழநி கோயில் தங்களை வரவேற்கிறோம்.\nதேர்வு செய்யவும் 👇'
      },
      footer: {
        text: 'விருப்பத்தைத் தேர்வு செய்யுங்கள்.'
      },
      action: {
        button: '📜 மெனு திறக்க',
        sections: [
          {
            title: 'கோவில் தகவல்கள்',
            rows: [
              {
                id: 'TALAVARALAR',
                title: '1️⃣ தலவரலாறு',
                description: 'வடபழநி கோயிலின் வரலாறு'
              },
              {
                id: 'POOJA',
                title: '2️⃣ பூஜை விபரம்',
                description: 'பூஜை நேரங்கள் மற்றும் விவரங்கள்'
              },
              {
                id: 'KATTANAM',
                title: '3️⃣ கட்டண தரிசனம்',
                description: 'அபிஷேகம் மற்றும் திருக்கல்யாணம் கட்டணம்'
              },
              {
                id: 'MARRIAGE',
                title: '4️⃣ திருமணம் பற்றிய விவரங்கள்',
                description: 'திருமண விவரங்கள் மற்றும் சான்றிதழ்கள்'
              }
            ]
          }
        ]
      }
    }
  });
}

// Long message (split into chunks)
async function sendPaginatedText(to, text) {
  const chunkSize = 3000; // safe limit
  const chunks = [];

  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }

  for (const chunk of chunks) {
    await sendText(to, chunk);
  }
}

module.exports = { sendText, sendMenuList, sendPaginatedText };
