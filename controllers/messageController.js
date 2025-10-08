const { sendText, sendPaginatedText, sendTextWithBackButton, sendImage } = require("../config/whatsapp");
const MESSAGES = require("../utils/messages");
const allRows = require("../utils/allRows");

exports.handleMessage = async (message) => {
  const from = message.from;
  let text = "";

  // 🟢 Handle text input
  if (message.type === "text") {
    text = message.text.body.trim().toLowerCase();

    if (["hi", "hii", "hello", "vanakkam", "வணக்கம்", "ji"].includes(text)) {
      await sendText(from, "🙏 வணக்கம்! அருள்மிகு வட பழநி ஆண்டவர் திருக்கோயில் தங்களை வரவேற்கிறது 🙏");
      await sendPaginatedText(from, "🛕 ஆலய தகவல் மெனு", "MAIN_MENU", allRows, 0);
      return;
    }

    const number = parseInt(text);
    if (!isNaN(number) && number > 0 && number <= allRows.length) {
      const selected = allRows[number - 1];
      const msg = MESSAGES[selected.id];

      if (msg?.type === "image") {
        await sendImage(from, msg.url, msg.caption);
      } else {
        await sendTextWithBackButton(from, `${msg || "⚠️ தவறான விருப்பம்."}`);
      }
      return;
    }

    await sendText(from, "⚠️ தெரியாத கட்டளை. தயவு செய்து 'hi' எனத் தட்டச்சு செய்யவும்.");
  }

  // 🟡 Handle list replies
  if (message.type === "interactive" && message.interactive.type === "list_reply") {
    const selectionId = message.interactive.list_reply.id;

    if (selectionId.startsWith("NEXT_MENU_")) {
      const nextIndex = parseInt(selectionId.split("_").pop());
      await sendPaginatedText(from, "🛕 ஆலய தகவல் மெனு", "MAIN_MENU", allRows, nextIndex);
      return;
    }

    if (selectionId === "BACK_TO_MAIN") {
      await sendPaginatedText(from, "🛕 ஆலய தகவல் மெனு", "MAIN_MENU", allRows, 0);
      return;
    }

    const msg = MESSAGES[selectionId];
    if (msg?.type === "image") {
      await sendImage(from, msg.url, msg.caption);
    } else {
      await sendTextWithBackButton(from, `${msg || "⚠️ தவறான விருப்பம்."}`);
    }
  }

  // 🟠 Handle button reply
  if (message.type === "interactive" && message.interactive.type === "button_reply") {
    if (message.interactive.button_reply.id === "BACK_TO_MAIN") {
      await sendPaginatedText(from, "🛕 ஆலய தகவல் மெனு", "MAIN_MENU", allRows, 0);
    }
  }
};
