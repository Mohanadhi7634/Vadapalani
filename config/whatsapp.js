// config/whatsapp.js
const axios = require('axios');

const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;

// ✅ Send message via WhatsApp Cloud API
async function sendMessage(data) {
  const url = `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`; // updated to v21.0
  try {
    const res = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    console.log("✅ Message sent:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Error sending message:", err.response?.data || err.message);
  }
}

// ✅ Send regular text message
async function sendText(to, text) {
  return sendMessage({
    messaging_product: 'whatsapp',
    to,
    type: 'text',
    text: { body: text },
  });
}

// ✅ Send menu buttons
async function sendMenuButtons(to) {
  return sendMessage({
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'interactive',
    interactive: {
      type: 'button',
      body: {
        text: 'அருள்மிகு வட பழநி ஆண்டவர் திருக்கோயில் தங்களை வரவேற்கிறது!\nதிருக்கோயில் சம்மந்தப்பட்ட அனைத்து தகவல்களும் தெரிந்து கொள்ள கீழே உள்ளவற்றில் தேர்ந்தெடுக்கவும்:',
      },
      action: {
        buttons: [
          { type: 'reply', reply: { id: 'THARISANAM', title: '1. தரிசன நேரம்' } },
          { type: 'reply', reply: { id: 'ABISHEGAM_NERAM', title: '2. அபிஷேகம் நேரம்' } },
          { type: 'reply', reply: { id: 'ABISHEGAM_CHARGE', title: '3. அபிஷேகம் கட்டண விவரங்கள்' } },
          { type: 'reply', reply: { id: 'KATANAM', title: '4. கட்டண விவரங்கள்' } },
          { type: 'reply', reply: { id: 'PIRATHANAI_KATTANAM', title: '5. பிரார்த்தனை கட்டண விவரங்கள்' } },
          { type: 'reply', reply: { id: 'PIRASAATHAM', title: '6. பிரசாத திட்ட விவரங்கள்' } },
          { type: 'reply', reply: { id: 'ANNATHANAM', title: '7. அன்னதானம்' } },
          { type: 'reply', reply: { id: 'NANKODAI', title: '8. நன்கொடை' } },
          { type: 'reply', reply: { id: 'MUDIKANIAKAI', title: '9. முடிகாணிக்கை' } },
          { type: 'reply', reply: { id: 'PARKING', title: '10. பார்க்கிங் பற்றிய விவரங்கள்' } },
          { type: 'reply', reply: { id: 'MARRIAGE', title: '11. திருமணம் பற்றிய விவரங்கள்' } },
        ],
      },
    },
  });
}

// ✅ Split long messages automatically
async function sendPaginatedText(to, text) {
  const chunkSize = 3000; // under WhatsApp safe limit
  for (let i = 0; i < text.length; i += chunkSize) {
    await sendText(to, text.slice(i, i + chunkSize));
  }
}

module.exports = { sendText, sendMenuButtons, sendPaginatedText };
