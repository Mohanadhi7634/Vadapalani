// controllers/messageController.js
const { sendText, sendPaginatedText, sendTextWithBackButton } = require("../config/whatsapp");
const MESSAGES = require("../utils/messages");
const allRows = require("../utils/allRows");

exports.handleMessage = async (message) => {
  const from = message.from;
  let text = "";

  // 🟢 Handle normal text
  if (message.type === "text") {
    text = message.text.body.trim().toLowerCase();

    // 👋 Greeting message
    if (["hi", "hii", "hello", "vanakkam", "வணக்கம்", "ji"].includes(text)) {
      await sendText(from, "🙏 வணக்கம்! அருள்மிகு வட பழநி ஆண்டவர் திருக்கோயில் தங்களை வரவேற்கிறது 🙏");

      try {
        await sendPaginatedText(from, "🛕 ஆலய தகவல் மெனு", "MAIN_MENU", allRows, 0);
      } catch (err) {
        console.error("⚠️ Error sending menu:", err.response?.data || err.message);
        await sendText(
          from,
          "📋 மெனுவை காண இயலவில்லை. தயவு செய்து எண் (1 முதல் 12 வரை) தட்டச்சு செய்து முயற்சி செய்யவும்."
        );
      }
      return;
    }

    // 🔢 If user typed a number instead of clicking
    const number = parseInt(text);
    if (!isNaN(number) && number > 0 && number <= allRows.length) {
      const selected = allRows[number - 1];
      const response = MESSAGES[selected.id] || "⚠️ தவறான விருப்பம்.";
      await sendTextWithBackButton(from, `${response}\n\nமுதன்மை மெனுவிற்கு திரும்ப வேண்டுமா?`);
      return;
    }

    await sendText(from, "⚠️ தெரியாத கட்டளை. தயவுசெய்து 'hi' அல்லது 'வணக்கம்' எனத் தட்டச்சு செய்யவும்.");
  }

  // 🟡 Handle list menu selections
  if (message.type === "interactive" && message.interactive.type === "list_reply") {
    const selectionId = message.interactive.list_reply.id;
    console.log("✅ Selected:", selectionId);

    if (selectionId.startsWith("NEXT_MENU_")) {
      const nextIndex = parseInt(selectionId.split("_").pop());
      await sendPaginatedText(from, "🛕 ஆலய தகவல் மெனு", "MAIN_MENU", allRows, nextIndex);
      return;
    }

    if (selectionId === "BACK_TO_MAIN") {
      await sendPaginatedText(from, "🛕 ஆலய தகவல் மெனு", "MAIN_MENU", allRows, 0);
      return;
    }

    const response = MESSAGES[selectionId] || "⚠️ தவறான விருப்பம்.";
    await sendTextWithBackButton(from, `${response}\n\nமுதன்மை மெனுவிற்கு திரும்ப வேண்டுமா?`);
  }

  // 🟠 Handle back button click
  if (message.type === "interactive" && message.interactive.type === "button_reply") {
    const buttonId = message.interactive.button_reply.id;
    if (buttonId === "BACK_TO_MAIN") {
      await sendPaginatedText(from, "🛕 ஆலய தகவல் மெனு", "MAIN_MENU", allRows, 0);
    }
  }
};
