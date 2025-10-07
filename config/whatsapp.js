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
    console.error(
      "❌ Error sending message:",
      JSON.stringify(error.response?.data, null, 2)
    );
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

// ✅ Send paginated list with “Next” & “Back”
async function sendPaginatedText(to, title, menuId, allRows, menuIndex = 0) {
  const chunkSize = 8; // 8 rows per page (safe)
  const chunks = [];

  // Split rows into chunks
  for (let i = 0; i < allRows.length; i += chunkSize) {
    chunks.push(allRows.slice(i, i + chunkSize));
  }

  const menuRows = chunks[menuIndex] ? [...chunks[menuIndex]] : [];

  // ✅ “Next” button (short title)
  if (menuIndex < chunks.length - 1) {
    menuRows.push({
      id: `NEXT_MENU_${menuIndex + 1}`,
      title: "⏭️ Next",
      description: "அடுத்த மெனுவைப் பார்க்க",
    });
  }

  // ✅ “Back” button (short title)
  if (menuIndex > 0) {
    menuRows.push({
      id: `BACK_TO_MAIN`,
      title: "🔙 Back",
      description: "முதன்மை மெனுவிற்கு திரும்ப",
    });
  }

  // ✅ Construct WhatsApp interactive list payload
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
