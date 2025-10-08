// config/whatsapp.js
const axios = require("axios");

const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;

// ✅ Common send function
async function sendMessage(data) {
  const url = `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`;
  try {
    await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    console.log("✅ Message sent successfully!");
  } catch (error) {
    console.error("❌ Error sending message:", JSON.stringify(error.response?.data, null, 2));
    throw error; // Let caller decide fallback
  }
}

// ✅ Simple text sender
async function sendText(to, text) {
  const data = {
    messaging_product: "whatsapp",
    to,
    type: "text",
    text: { body: text },
  };
  await sendMessage(data);
}

// ✅ Send paginated list (with fallback)
async function sendPaginatedText(to, title, menuId, allRows, menuIndex = 0) {
  const chunkSize = 9; // WhatsApp limit (10 rows per section max)
  const chunks = [];

  // Split rows into chunks of 9
  for (let i = 0; i < allRows.length; i += chunkSize) {
    chunks.push(allRows.slice(i, i + chunkSize));
  }

  const menuRows = chunks[menuIndex] ? [...chunks[menuIndex]] : [];

  // Add navigation
  if (menuIndex < chunks.length - 1) {
    menuRows.push({
      id: `NEXT_MENU_${menuIndex + 1}`,
      title: "➡️ Next",
      description: "அடுத்த மெனுவைப் பார்க்க",
    });
  }
  if (menuIndex > 0) {
    menuRows.push({
      id: `BACK_TO_MAIN`,
      title: "⬅️ Back",
      description: "முதன்மை மெனுவிற்கு திரும்ப",
    });
  }

  const data = {
    messaging_product: "whatsapp",
    to,
    type: "interactive",
    interactive: {
      type: "list",
      header: { type: "text", text: title },
      body: {
        text: "திருக்கோயில் சம்மந்தப்பட்ட அனைத்து தகவல்களும் தெரிந்து கொள்ள கீழே உள்ளவற்றில் தேர்ந்தெடுக்கவும்👇",
      },
      action: {
        button: "🔽 மெனுவைக் காண",
        sections: [
          {
            title: "📜 விருப்பங்கள்",
            rows: menuRows,
          },
        ],
      },
    },
  };

  try {
    await sendMessage(data);
  } catch (error) {
    console.log("⚠️ List not supported — sending fallback text instead.");
    console.error(error.response?.data || error.message);

    // Fallback simple text for PC or errors
    let menuText = `🛕 ${title}\n\n`;
    menuRows.forEach((r, i) => {
      menuText += `${i + 1}. ${r.title}\n`;
    });
    menuText += `\n👉 தயவு செய்து எண் அல்லது பெயரை தட்டச்சு செய்யவும்.`;
    await sendText(to, menuText);
  }
}

// ✅ Send text with back button
async function sendTextWithBackButton(to, text) {
  const data = {
    messaging_product: "whatsapp",
    to,
    type: "interactive",
    interactive: {
      type: "button",
      body: { text },
      action: {
        buttons: [
          {
            type: "reply",
            reply: { id: "BACK_TO_MAIN", title: "🔙 Back" },
          },
        ],
      },
    },
  };

  try {
    await sendMessage(data);
  } catch (error) {
    console.log("⚠️ Button not supported — sending fallback text.");
    await sendText(to, `${text}\n\n(முதன்மை மெனுவிற்கு திரும்ப 'hi' எனத் தட்டச்சு செய்யவும்)`);
  }
}

module.exports = {
  sendText,
  sendPaginatedText,
  sendTextWithBackButton,
};
