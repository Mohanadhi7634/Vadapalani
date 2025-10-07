const { sendText, sendPaginatedText } = require("../config/whatsapp");
const MESSAGES = require("../utils/messages");
const allRows = require("../utils/allRows");

exports.handleMessage = async (message) => {
  const from = message.from;
  let text = "";

  // ✅ Handle plain text input
  if (message.type === "text") {
    text = message.text.body.trim().toLowerCase();

    if (["hi", "hii", "hello", "vanakkam", "ji"].includes(text)) {
      await sendText(from, "🙏 வணக்கம்! வரவேற்கிறோம்! மெனுவைக் காண கீழே உள்ளதைத் தொடவும் 👇");
      await sendPaginatedText(from, "🛕 ஆலய தகவல் மெனு", "MAIN_MENU", allRows, 0);
      return;
    }

    // Manual "next" command (optional)
    if (text === "next") {
      await sendPaginatedText(from, "🛕 ஆலய தகவல் மெனு", "MAIN_MENU", allRows, 1);
      return;
    }

    await sendText(from, "⚠️ தெரியாத கட்டளை. தயவுசெய்து 'hi' அல்லது 'வணக்கம்' எனத் தட்டச்சு செய்யவும்.");
  }

  // ✅ Handle list reply
  if (message.type === "interactive" && message.interactive.type === "list_reply") {
    const selectionId = message.interactive.list_reply.id;
    console.log("✅ Selected:", selectionId);

    // ✅ Pagination handler
    if (selectionId.startsWith("NEXT_MENU_")) {
      const nextIndex = parseInt(selectionId.split("_").pop());
      await sendPaginatedText(from, "🛕 ஆலய தகவல் மெனு", "MAIN_MENU", allRows, nextIndex);
      return;
    }

    // ✅ Back button handler
    if (selectionId === "BACK_TO_MAIN") {
      await sendPaginatedText(from, "🛕 ஆலய தகவல் மெனு", "MAIN_MENU", allRows, 0);
      return;
    }

    // ✅ Normal menu item selected
    const response = MESSAGES[selectionId] || "⚠️ தவறான விருப்பம்.";
    await sendText(from, response);
  }
};
