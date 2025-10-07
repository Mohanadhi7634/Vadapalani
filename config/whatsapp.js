const axios = require("axios");

const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;

// ✅ Helper to send any message via WhatsApp Cloud API
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

// ✅ Send paginated list with "Next" and "Back to Main Menu"
async function sendPaginatedText(to, title, menuId, allRows, menuIndex = 0) {
  const chunkSize = 8; // 8 items + 1 Next + 1 Back = 10 total allowed
  const chunks = [];

  // Split into chunks of 8
  for (let i = 0; i < allRows.length; i += chunkSize) {
    chunks.push(allRows.slice(i, i + chunkSize));
  }

  const menuRows = chunks[menuIndex] ? [...chunks[menuIndex]] : [];

  // ✅ Add “Next” option if there’s another page
  if (menuIndex < chunks.length - 1) {
    menuRows.push({
      id: `NEXT_MENU_${menuIndex + 1}`,
      title: "⏭️ மேலும் (Next)",
      description: "அடுத்த மெனுவைக் காண",
    });
  }

  // ✅ Always add “Back to Main Menu” option (except on first page)
  if (menuIndex > 0) {
    menuRows.push({
      id: `BACK_TO_MAIN`,
      title: "🔙 முதன்மை மெனுவிற்கு திரும்பு",
      description: "முதன்மை மெனுவைக் காண",
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
  sendPaginatedText,
};
