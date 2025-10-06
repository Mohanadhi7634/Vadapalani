const { sendText, sendMenuList, sendPaginatedText } = require('../config/whatsapp');
const MESSAGES = require('../utils/messages');

exports.handleMessage = async (message) => {
  const from = message.from;
  let text = '';

  // If text message
  if (message.type === 'text') {
    text = message.text.body.trim().toLowerCase();

    if (['hi', 'hii', 'hello', 'வணக்கம்'].includes(text)) {
      return sendMenuList(from); // send menu
    }

    return sendText(from, 'மன்னிக்கவும். "hi" அனுப்பி மெனு பார்க்கவும்.');
  }

  // If user selects list item
  if (message.type === 'interactive' && message.interactive.list_reply) {
    const listId = message.interactive.list_reply.id;

    if (listId === 'DARISANAM') return sendPaginatedText(from, MESSAGES.DARISANAM);
    if (listId === 'ABISHEGAM_TIME') return sendPaginatedText(from, MESSAGES.ABISHEGAM_TIME);
    if (listId === 'ABISHEGAM_FEES') return sendPaginatedText(from, MESSAGES.ABISHEGAM_FEES);
    if (listId === 'KATTANA_FEES') return sendPaginatedText(from, MESSAGES.KATTANA_FEES);
    if (listId === 'PRARTHANA') return sendPaginatedText(from, MESSAGES.PRARTHANA);
    if (listId === 'PRASADHA') return sendPaginatedText(from, MESSAGES.PRASADHA);
    if (listId === 'ANNADHANAM') return sendPaginatedText(from, MESSAGES.ANNADHANAM);
    if (listId === 'NANKODAI') return sendPaginatedText(from, MESSAGES.NANKODAI);
    if (listId === 'MUDIKANIKAI') return sendPaginatedText(from, MESSAGES.MUDIKANIKAI);
    if (listId === 'PARKING') return sendPaginatedText(from, MESSAGES.PARKING);
    if (listId === 'MARRIAGE') return sendPaginatedText(from, MESSAGES.MARRIAGE);
  }

  return sendText(from, 'மன்னிக்கவும். சரியான விருப்பத்தைத் தேர்வு செய்யவும்.');
};
