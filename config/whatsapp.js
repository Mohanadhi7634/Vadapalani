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

// Send menu as WhatsApp list (max 10 rows per section)
async function sendMenuList(to) {
  return sendMessage({
    messaging_product: 'whatsapp',
    recipient_type: "individual",
    to,
    type: 'interactive',
    interactive: {
      type: 'list',
      body: { text: '🌸 அருள்மிகு வடபழநி ஆண்டவர் திருக்கோயில் தங்களை வரவேற்கிறது.\nதேர்வு செய்யவும் 👇' },
      footer: { text: 'விருப்பத்தைத் தேர்வு செய்யுங்கள்.' },
      action: {
        button: '📜 மெனு திறக்க',
        sections: [
          {
            title: 'கோவில் தகவல்கள் - பாகம் 1',
            rows: [
              { id: 'DARISANAM', title: '1️⃣ தரிசனம்', description: 'தரிசன நேரம்' },
              { id: 'ABISHEGAM_TIME', title: '2️⃣ அபிஷேகம்', description: 'அபிஷேகம் நேரம்' },
              { id: 'ABISHEGAM_FEES', title: '3️⃣ அபிஷேகம் கட்டணம்', description: 'அபிஷேகம் கட்டண விவரங்கள்' },
              { id: 'KATTANA_FEES', title: '4️⃣ கட்டண விவரங்கள்', description: 'திருக்கல்யாணம் & அபிஷேகம்' },
              { id: 'PRARTHANA', title: '5️⃣ பிரார்த்தனை', description: 'பிரார்த்தனை கட்டண விவரங்கள்' },
              { id: 'PRASADHA', title: '6️⃣ பிரசாதம்', description: 'பிரசாத திட்ட விவரங்கள்' },
              { id: 'ANNADHANAM', title: '7️⃣ அன்னதானம்', description: 'அன்னதானம் செலுத்தும் விதிகள்' },
              { id: 'NANKODAI', title: '8️⃣ நன்கொடை', description: 'நன்கொடைகள் & வழிகள்' },
              { id: 'MUDIKANIKAI', title: '9️⃣ முடிகாணிக்கை', description: 'முடிகாணிக்கை கட்டணம் & வசதி' },
              { id: 'PARKING', title: '🔟 பார்க்கிங்', description: 'வாகன நிறுத்தம் & கட்டணம்' }
            ]
          },
          {
            title: 'கோவில் தகவல்கள் - பாகம் 2',
            rows: [
              { id: 'MARRIAGE', title: '1️⃣ திருமணம்', description: 'திருமணச் சான்றிதழ்கள் & கட்டணம்' }
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
