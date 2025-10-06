// handlers/messageHandler.js
const { sendText, sendMenuButtons, sendPaginatedText } = require('../config/whatsapp');
const MESSAGES = require('../utils/messages');

exports.handleMessage = async (message) => {
  const from = message.from;
  let text = '';

  // ✅ Handle normal text message
  if (message.type === 'text') {
    text = message.text.body.trim().toLowerCase();

    if (['hi', 'hii', 'hello', 'வணக்கம்'].includes(text)) {
      return sendMenuButtons(from);
    }

    // Map for quick lookup
    const textMap = {
      '1': 'THARISANAM',
      '2': 'ABISHEGAM_NERAM',
      '3': 'ABISHEGAM_CHARGE',
      '4': 'KATANAM',
      '5': 'PIRATHANAI_KATTANAM',
      '6': 'PIRASAATHAM',
      '7': 'ANNATHANAM',
      '8': 'NANKODAI',
      '9': 'MUDIKANIAKAI',
      '10': 'PARKING',
      '11': 'MARRIAGE',
    };

    // Check if number or keyword matches
    for (const [key, id] of Object.entries(textMap)) {
      if (text.includes(key) || text.includes(id.toLowerCase())) {
        return sendPaginatedText(from, MESSAGES[id]);
      }
    }

    return sendText(from, 'மன்னிக்கவும். "hi" என அனுப்பி மெனு பார்க்கவும்.');
  }

  // ✅ Handle interactive button clicks
  if (message.type === 'interactive') {
    const btnId = message.interactive.button_reply.id;
    if (MESSAGES[btnId]) {
      return sendPaginatedText(from, MESSAGES[btnId]);
    }
  }
};
