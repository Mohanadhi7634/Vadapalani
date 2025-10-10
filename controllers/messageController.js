const { sendText, sendPaginatedText, sendTextWithBackButton, sendMessage } = require("../config/whatsapp");
const MESSAGES = require("../utils/messages");
const allRows = require("../utils/allRows");
const abishegamFees = require("../utils/abishegamFees");

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
      const selectedOption = allRows[number - 1];

      // 🖼️ TEMPLE_PHOTO
      if (selectedOption.id === "TEMPLE_PHOTO") {
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
            body: { text: "🙏 வட பழநி ஆண்டவர் திருக்கோவில் படம் 🙏" },
            action: {
              buttons: [
                { type: "reply", reply: { id: "BACK_TO_MAIN", title: "🔙 பின் செல்ல" } }
              ]
            }
          }
        };
        await sendMessage(data);
        return;
      }

      // 💰 Abishegam Fees
      if (selectedOption.id === "ABISHEGAM_FEES") {
        let messageText = '💰 *அபிஷேக கட்டணங்கள்*\n\n';
        abishegamFees.forEach(item => {
          messageText += `- ${item.title} – ${item.description}\n`;
          if (item.url) messageText += `[பணம் செலுத்த](${item.url})\n`;
          messageText += '\n';
        });
        await sendTextWithBackButton(from, messageText);
        return;
      }

      // 📝 Default: text responses
      const response = MESSAGES[selectedOption.id] || "⚠️ தவறான விருப்பம்.";
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

    // 🖼️ TEMPLE_PHOTO for list replies
    if (selectionId === "TEMPLE_PHOTO") {
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
          body: { text: "🙏 வட பழநி ஆண்டவர் திருக்கோவில் படம் 🙏" },
          action: {
            buttons: [
              { type: "reply", reply: { id: "BACK_TO_MAIN", title: "🔙 பின் செல்ல" } }
            ]
          }
        }
      };
      await sendMessage(data);
      return;
    }

    // 💰 Abishegam Fees for list replies
    if (selectionId === "ABISHEGAM_FEES") {
      let messageText = '💰 *அபிஷேக கட்டணங்கள்*\n\n';
      abishegamFees.forEach(item => {
        messageText += `- ${item.title} – ${item.description}\n`;
        if (item.url) messageText += `[பணம் செலுத்த](${item.url})\n`;
        messageText += '\n';
      });
      await sendTextWithBackButton(from, messageText);
      return;
    }

    // 📝 Default text for other list options
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
