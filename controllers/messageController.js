const { sendText, sendPaginatedText, sendTextWithBackButton, sendImage } = require("../config/whatsapp");
const MESSAGES = require("../utils/messages");
const allRows = require("../utils/allRows");

exports.handleMessage = async (message) => {
  const from = message.from;
  let text = "";

  // 🔹 Handle normal text messages
  if (message.type === "text") {
    text = message.text.body.trim().toLowerCase();

    if (["hi", "hii", "hello", "vanakkam", "ji"].includes(text)) {
      await sendText(from, "🙏 வணக்கம்! அருள்மிகு வடபழநி ஆண்டவர் திருக்கோயில் தங்களை வரவேற்கிறது!");
      await sendPaginatedText(from, "🛕 ஆலய தகவல் மெனு", "MAIN_MENU", allRows, 0);
      return;
    }

    await sendText(from, "⚠️ தெரியாத கட்டளை. தயவுசெய்து 'hi' அல்லது 'வணக்கம்' எனத் தட்டச்சு செய்யவும்.");
  }

  // 🔹 Handle menu selections
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

    // 🖼️ If photo option is selected
    if (selectionId === "VADAPALANI_PHOTO") {
      const imageUrl = "https://your-domain.com/images/Sc0110101.png"; // replace with your public or local URL
      await sendImage(from, imageUrl, "🙏 அருள்மிகு வடபழநி ஆண்டவர் திருவுருவம் 🙏");
      await sendTextWithBackButton(from, "🔙 முதன்மை மெனுவிற்கு திரும்ப வேண்டுமா?");
      return;
    }

    // Normal text menu responses
    const response = MESSAGES[selectionId] || "⚠️ தவறான விருப்பம்.";
    const combinedMessage = `${response}\n\n🔙 முதன்மை மெனுவிற்கு திரும்ப வேண்டுமா?`;
    await sendTextWithBackButton(from, combinedMessage);
  }

  // 🔹 Handle back button click
  if (message.type === "interactive" && message.interactive.type === "button_reply") {
    const buttonId = message.interactive.button_reply.id;
    if (buttonId === "BACK_TO_MAIN") {
      await sendPaginatedText(from, "🛕 ஆலய தகவல் மெனு", "MAIN_MENU", allRows, 0);
    }
  }
};
