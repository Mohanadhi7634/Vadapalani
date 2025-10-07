const axios = require("axios");

const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;

// ✅ Helper to send any message via WhatsApp Cloud API
async function sendMessage(data) {
  const url = `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`;
  try {
    const res = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    console.log("✅ Message sent successfully!");
  } catch (error) {
    console.error("❌ Error sending message:", JSON.stringify(error.response?.data, null, 2));
  }
}

// ✅ Send plain text message
async function sendText(to, text) {
  await sendMessage({
    messaging_product: "whatsapp",
    to,
    type: "text",
    text: { body: text },
  });
}

// ✅ Send button menu (max 3 buttons)
async function sendMenuButtons(to, bodyText, buttons) {
  if (buttons.length > 3) {
    console.warn("⚠️ WhatsApp only allows up to 3 buttons per message.");
    buttons = buttons.slice(0, 3);
  }

  const data = {
    messaging_product: "whatsapp",
    to,
    type: "interactive",
    interactive: {
      type: "button",
      body: { text: bodyText },
      action: { buttons },
    },
  };

  await sendMessage(data);
}

// ✅ Send paginated list (multi-page list menu)
async function sendPaginatedText(to, title, menuId, allRows, menuIndex = 0) {
  const chunkSize = 9; // ✅ 9 rows + 1 "Next" = 10 total allowed
  const chunks = [];

  // Split allRows into chunks of 9
  for (let i = 0; i < allRows.length; i += chunkSize) {
    chunks.push(allRows.slice(i, i + chunkSize));
  }

  const menuRows = chunks[menuIndex] || [];

  // Add “Next” row if more pages exist
  if (menuIndex < chunks.length - 1) {
    menuRows.push({
      id: `NEXT_MENU_${menuIndex + 1}`,
      title: "⏭️ மேலும் (Next)",
      description: "அடுத்த மெனுவைக் காண",
    });
  }

  const data = {
    messaging_product: "whatsapp",
    to,
    type: "interactive",
    interactive: {
      type: "list",
      header: { type: "text", text: title },
      body: { text: "தயவுசெய்து ஒரு விருப்பத்தைத் தேர்வுசெய்க 👇" },
      footer: { text: "Powered by Mohan Bot 🤖" },
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

  await sendMessage(data);
}

module.exports = {
  sendText,
  sendMenuButtons,
  sendPaginatedText,
};
