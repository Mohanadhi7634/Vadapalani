const { sendText, sendMenuPage1, sendMenuPage2, sendPaginatedText } = require('../config/whatsapp');
const MESSAGES = require('../utils/messages');

exports.handleMessage = async (message) => {
  const from = message.from;
  let text = '';

  // --- Text message received ---
  if (message.type === 'text') {
    text = message.text.body.trim().toLowerCase();

    if (['hi', 'hii', 'hello', 'வணக்கம்'].includes(text)) {
      return sendMenuPage1(from);
    }
    if (text === '1' || text.includes('தலவரலாறு')) {
      return sendPaginatedText(from, MESSAGES.TALAVARALAR);
    }
    if (text === '2' || text.includes('பூஜை')) {
      return sendPaginatedText(from, MESSAGES.POOJA_VIPARAM);
    }
    if (text === '3' || text.includes('கட்டண')) {
      return sendPaginatedText(from, MESSAGES.KATTANA);
    }
    if (text === '4' || text.includes('திருமணம்')) {
      return sendPaginatedText(from, MESSAGES.MARRIAGE);
    }

    return sendText(from, 'மன்னிக்கவும். "hi" அனுப்பி மெனு பார்க்கவும்.');
  }

  // --- Button click received ---
  if (message.type === 'interactive') {
    const btnId = message.interactive.button_reply.id;

    if (btnId === 'TALAVARALAR') return sendPaginatedText(from, MESSAGES.TALAVARALAR);
    if (btnId === 'POOJA') return sendPaginatedText(from, MESSAGES.POOJA_VIPARAM);
    if (btnId === 'KATTANAM') return sendPaginatedText(from, MESSAGES.KATTANA);
    if (btnId === 'MARRIAGE') return sendPaginatedText(from, MESSAGES.MARRIAGE);
    if (btnId === 'NEXT_MENU') return sendMenuPage2(from);
    if (btnId === 'BACK_MENU') return sendMenuPage1(from);
  }
};
