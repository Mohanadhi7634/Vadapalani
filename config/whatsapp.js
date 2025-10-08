const axios = require("axios");

const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;

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
    return res.data;
  } catch (error) {
    console.error("❌ Error sending message:", JSON.stringify(error.response?.data, null, 2));
    throw error;
  }
}

async function sendText(to, text) {
  const data = {
    messaging_product: "whatsapp",
    to,
    type: "text",
    text: { body: text },
  };
  await sendMessage(data);
}

async function sendPaginatedText(to, title, menuId, allRows, menuIndex = 0) {
  const chunkSize = 9;
  const chunks = [];
  for (let i = 0; i < allRows.length; i += chunkSize) chunks.push(allRows.slice(i, i + chunkSize));
  const menuRows = chunks[menuIndex] ? [...chunks[menuIndex]] : [];

  if (menuIndex < chunks.length - 1) {
    menuRows.push({ id: `NEXT_MENU_${menuIndex + 1}`, title: "➡️ அடுத்தது", description: "அடுத்த மெனுவைப் பார்க்க" });
  }
  if (menuIndex > 0) {
    menuRows.push({ id: `BACK_TO_MAIN`, title: "⬅️ பின் செல்ல", description: "முந்தைய மெனுவிற்கு திரும்ப" });
  }

  const data = {
    messaging_product: "whatsapp",
    to,
    type: "interactive",
    interactive: {
      type: "list",
      header: { type: "text", text: title },
      body: { text: "திருக்கோயில் தொடர்பான தகவல்களை அறிய கீழே உள்ளவற்றில் தேர்ந்தெடுக்கவும்👇" },
      action: { button: "🔽 மெனுவைக் காண", sections: [{ title: "📜 விருப்பங்கள்", rows: menuRows }] },
    },
  };

  try {
    await sendMessage(data);
  } catch (error) {
    console.log("⚠️ List not supported — fallback text sent.");
    let menuText = `🛕 ${title}\n\n`;
    menuRows.forEach((r, i) => { menuText += `${i + 1}. ${r.title}\n`; });
    menuText += `\n👉 எண் அல்லது பெயரை தட்டச்சு செய்யவும்.`;
    await sendText(to, menuText);
  }
}

async function sendTextWithBackButton(to, text) {
  const data = {
    messaging_product: "whatsapp",
    to,
    type: "interactive",
    interactive: { type: "button", body: { text }, action: { buttons: [{ type: "reply", reply: { id: "BACK_TO_MAIN", title: "🔙 பின் செல்ல" } }] } },
  };
  try { await sendMessage(data); } 
  catch (error) { console.log("⚠️ Button not supported — fallback text sent."); await sendText(to, `${text}\n\n(முதன்மை மெனுவிற்கு திரும்ப 'hi' எனத் தட்டச்சு செய்யவும்)`); }
}

module.exports = { sendText, sendPaginatedText, sendTextWithBackButton,  sendMessage,   };
