// handlers/messageHandler.js
const { sendText, sendMenuList, sendPaginatedText } = require('../config/whatsapp');
const MESSAGES = require('../utils/messages');

exports.handleMessage = async (message) => {
  const from = message.from;
  let text = '';

  // If it's a text message
  if (message.type === 'text') {
    text = message.text.body.trim().toLowerCase();

    if (['hi', 'hii', 'hello', 'வணக்கம்'].includes(text)) {
      return sendMenuList(from); // send list menu
    }

    return sendText(from, 'மன்னிக்கவும். "hi" அனுப்பி மெனு பார்க்கவும்.');
  }

  // If user selects list item
  if (message.type === 'interactive' && message.interactive.list_reply) {
    const listId = message.interactive.list_reply.id;

    if (listId === 'TALAVARALAR') return sendPaginatedText(from, MESSAGES.TALAVARALAR);
    if (listId === 'POOJA') return sendPaginatedText(from, MESSAGES.POOJA_VIPARAM);
    if (listId === 'KATTANAM') return sendPaginatedText(from, MESSAGES.KATTANA);
    if (listId === 'MARRIAGE') return sendPaginatedText(from, MESSAGES.MARRIAGE);
  }

  return sendText(from, 'மன்னிக்கவும். சரியான விருப்பத்தைத் தேர்வு செய்யவும்.');
};
