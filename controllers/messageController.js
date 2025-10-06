// handlers/messageHandler.js
const { sendText, sendPaginatedText } = require('../config/whatsapp');
const MESSAGES = require('../utils/messages');

exports.handleMessage = async (message) => {
  const from = message.from;
  let text = '';

  if (message.type === 'text') {
    text = message.text.body.trim().toLowerCase();

    if (['hi', 'hii', 'hello', 'வணக்கம்'].includes(text)) {
      // Send plain text menu (no buttons)
      return sendText(from, MESSAGES.WELCOME_MENU);
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
};
