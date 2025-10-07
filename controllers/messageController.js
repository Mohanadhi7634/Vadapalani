const { sendText, sendMenuButtons, sendPaginatedText } = require('../config/whatsapp');
const MESSAGES = require('../utils/messages');
const allRows = require('../utils/allRows');

exports.handleMessage = async (message) => {
  const from = message.from;
  let text = '';

  if (message.type === 'text') {
    text = message.text.body.trim().toLowerCase();

    if (['hi', 'hii', 'hello', 'vanakkam', 'ji'].includes(text)) {
      await sendText(from, "🙏 வணக்கம்! வரவேற்கிறோம்! மெனுவைக் காண கீழே உள்ளதைத் தொடவும் 👇");

      // ✅ First page (index 0)
      await sendPaginatedText(from, "🛕 ஆலய தகவல் மெனு", "MAIN_MENU", allRows, 0);
      return;
    }

    // If the user types "next" manually (optional)
    if (text === 'next') {
      await sendPaginatedText(from, "🛕 ஆலய தகவல் மெனு", "MAIN_MENU", allRows, 1);
      return;
    }

    // Default fallback
    await sendText(from, "⚠️ தெரியாத கட்டளை. தயவுசெய்து 'hi' அல்லது 'வணக்கம்' எனத் தட்டச்சு செய்யவும்.");
  }

  // Handle list replies
  if (message.type === 'interactive' && message.interactive.type === 'list_reply') {
    const selectionId = message.interactive.list_reply.id;
    console.log("✅ Selected:", selectionId);

    // Pagination handler
    if (selectionId.startsWith('NEXT_MENU_')) {
      const nextIndex = parseInt(selectionId.split('_').pop());
      await sendPaginatedText(from, "🛕 ஆலய தகவல் மெனு", "MAIN_MENU", allRows, nextIndex);
      return;
    }

    // Otherwise handle normal menu selections
    const response = MESSAGES[selectionId] || "⚠️ தவறான விருப்பம்.";
    await sendText(from, response);
  }
};
