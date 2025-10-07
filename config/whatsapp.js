const axios = require("axios");

const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;

// 🔹 Send message via WhatsApp Cloud API
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

// 🔹 Send text message
async function sendText(to, text) {
  await sendMessage({
    messaging_product: "whatsapp",
    to,
    type: "text",
    text: { body: text },
  });
}

// 🔹 Send image message
async function sendImage(to, imageUrl, caption = "") {
  await sendMessage({
    messaging_product: "whatsapp",
    to,
    type: "image",
    image: {
      link: imageUrl,
      caption,
    },
  });
}

// 🔹 Send paginated list menu
async function sendPaginatedText(to, title, menuId, allRows, menuIndex = 0) {
  const chunkSize = 9;
  const chunks = [];

  for (let i = 0; i < allRows.length; i += chunkSize) {
    chunks.push(allRows.slice(i, i + chunkSize));
  }

  const menuRows = chunks[menuIndex] ? [...chunks[menuIndex]] : [];

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

// 🔹 Send text with “Back” button
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
            reply: { id: "BACK_TO_MAIN", title: "⬅️ Back" },
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
  sendTextWithBackButton,
  sendImage,
};
