const { sendText, sendMenuList, sendPaginatedText } = require('../config/whatsapp');
const MESSAGES = require('../utils/messages');

exports.handleMessage = async (message) => {
  const from = message.from;
  let text = '';

  // Text message
  if (message.type === 'text') {
    text = message.text.body.trim().toLowerCase();
    if (['hi', 'hii', 'hello', 'வணக்கம்', 'ji'].includes(text)) {
      return sendMenuList(from);
    }
    return sendText(from, 'மன்னிக்கவும். "hi" அனுப்பி மெனு பார்க்கவும்.');
  }

  // Interactive list reply
  if (message.type === 'interactive' && message.interactive.list_reply) {
    const listId = message.interactive.list_reply.id;

    switch (listId) {
      case 'DARISANAM': return sendPaginatedText(from, MESSAGES.DARISANAM);
      case 'ABISHEGAM_TIME': return sendPaginatedText(from, MESSAGES.ABISHEGAM_TIME);
      case 'ABISHEGAM_FEES': return sendPaginatedText(from, MESSAGES.ABISHEGAM_FEES);
      case 'KATTANA_FEES': return sendPaginatedText(from, MESSAGES.KATTANA_FEES);
      case 'PRARTHANA': return sendPaginatedText(from, MESSAGES.PRARTHANA);
      case 'PRASADHA': return sendPaginatedText(from, MESSAGES.PRASADHA);
      case 'ANNADHANAM': return sendPaginatedText(from, MESSAGES.ANNADHANAM);
      case 'NANKODAI': return sendPaginatedText(from, MESSAGES.NANKODAI);
      case 'MUDIKANIKAI': return sendPaginatedText(from, MESSAGES.MUDIKANIKAI);
      case 'PARKING': return sendPaginatedText(from, MESSAGES.PARKING);
      case 'MARRIAGE': return sendPaginatedText(from, MESSAGES.MARRIAGE);
      default:
        return sendText(from, 'மன்னிக்கவும். சரியான விருப்பத்தைத் தேர்வு செய்யவும்.');
    }
  }

  return sendText(from, 'மன்னிக்கவும். சரியான விருப்பத்தைத் தேர்வு செய்யவும்.');
};
