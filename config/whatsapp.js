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

async function sendText(to, text) {
  return sendMessage({
    messaging_product: 'whatsapp',
    to,
    type: 'text',
    text: { body: text }
  });
}

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

module.exports = { sendText, sendMenuButtons };
