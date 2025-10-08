const { sendText, sendPaginatedText, sendTextWithBackButton, sendMessage } = require("../config/whatsapp");

const MESSAGES = require("../utils/messages");
const allRows = require("../utils/allRows");

exports.handleMessage = async (message) => {
  const from = message.from;
  let text = "";

  // 🟢 Handle text input
  if (message.type === "text") {
    text = message.text.body.trim().toLowerCase();

    // 👋 Greeting / Restart
    if (["hi","hii","hello","vanakkam","வணக்கம்","ji"].includes(text)) {
      await sendText(from, "🙏 வணக்கம்! அருள்மிகு வட பழநி ஆண்டவர் திருக்கோயில் தங்களை வரவேற்கிறது 🙏");
      await sendPaginatedText(from, "🛕 ஆலய தகவல் மெனு", "MAIN_MENU", allRows, 0);
      return;
    }

    // 🔢 Handle numeric selection
    const number = parseInt(text);
    if (!isNaN(number) && number > 0 && number <= allRows.length) {
      const selected = allRows[number - 1];

      // 🖼️ Option 12: TEMPLE_PHOTO
      if (selected.id === "TEMPLE_PHOTO") {
        const data = {
          messaging_product: "whatsapp",
          to: from,
          type: "image",
          image: {
            link: "https://res.cloudinary.com/dyaubvua4/image/upload/v1759909099/Vadapalani_Andavar_ismvwo.jpg",
            caption: "🙏 வட பழநி ஆண்டவர் திருக்கோவில் படம் 🙏"
          }
        };
        await sendMessage(data);

        // Optional back button
        await sendTextWithBackButton(from, "🔙 முதன்மை மெனுவிற்கு திரும்ப");
        return;
      }

      // 📝 Default: text responses
      const response = MESSAGES[selected.id] || "⚠️ தவறான விருப்பம்.";
      await sendTextWithBackButton(from, `${response}\n\nமுதன்மை மெனுவிற்கு திரும்ப வேண்டுமா?`);
      return;
    }

    // ❌ Unknown text fallback
    await sendText(from, "⚠️ தெரியாத கட்டளை. தயவு செய்து 'hi' அல்லது 'வணக்கம்' எனத் தட்டச்சு செய்யவும்.");
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

   if (selected.id === "TEMPLE_PHOTO") {
  const data = {
    messaging_product: "whatsapp",
    to: from,
    type: "interactive",
    interactive: {
      type: "button",
      header: {
        type: "image",
        image: {
          link: "https://res.cloudinary.com/dyaubvua4/image/upload/v1759909099/Vadapalani_Andavar_ismvwo.jpg"
        }
      },
      body: {
        text: "🙏 வட பழநி ஆண்டவர் திருக்கோவில் படம் 🙏"
      },
      action: {
        buttons: [
          {
            type: "reply",
            reply: {
              id: "BACK_TO_MAIN",
              title: "🔙 பின் செல்ல"
            }
          }
        ]
      }
    }
  };

  await sendMessage(data); // send the interactive image message
  return; // done
}

    const response = MESSAGES[selectionId] || "⚠️ தவறான விருப்பம்.";
    await sendTextWithBackButton(from, `${response}\n\nமுதன்மை மெனுவிற்கு திரும்ப வேண்டுமா?`);
  }

  // 🟠 Handle button replies (Back button)
  if (message.type === "interactive" && message.interactive.type === "button_reply") {
    const buttonId = message.interactive.button_reply.id;
    if (buttonId === "BACK_TO_MAIN") {
      await sendPaginatedText(from, "🛕 ஆலய தகவல் மெனு", "MAIN_MENU", allRows, 0);
    }
  }
};
