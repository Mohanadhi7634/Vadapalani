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
  const chunkSize = 3000;
  for (let i = 0; i < text.length; i += chunkSize) {
    await sendText(to, text.slice(i, i + chunkSize));
  }
}

// ✅ Send main menu (10 items + Next button)
async function sendMenuList(to, menuIndex = 0) {
  const chunkSize = 10;
  const chunks = [];
  for (let i = 0; i < allRows.length; i += chunkSize) {
    chunks.push(allRows.slice(i, i + chunkSize));
  }

  const menuRows = chunks[menuIndex] || [];

  // Add "Next" button if there are more menus
  if (menuIndex < chunks.length - 1) {
    menuRows.push({
      id: `NEXT_MENU_${menuIndex + 1}`,
      title: '⏭️ மேலும் (Next)',
      description: 'அடுத்த மெனுவைக் காண'
    });
  }

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
            title: `மெனு ${menuIndex + 1}`,
            rows: menuRows
          }
        ]
      }
    }
  });
}

// ✅ Send message with "Go to Main Menu" button
async function sendMessageWithMainMenu(to, text) {
  await sendMessage({
    messaging_product: 'whatsapp',
    to,
    type: 'interactive',
    interactive: {
      type: 'button',
      body: { text },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: 'GO_MAIN_MENU',
              title: '🔙 முதன்மை மெனு'
            }
          }
        ]
      }
    }
  });
}

module.exports = { sendText, sendPaginatedText, sendMenuList, sendMessageWithMainMenu };
