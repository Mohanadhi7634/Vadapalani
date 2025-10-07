const { sendText, sendPaginatedText, sendMenuList, sendMessageWithMainMenu } = require('../config/whatsapp');
const MESSAGES = require('../utils/messages');

exports.handleMessage = async (message) => {
  const from = message.from;
  let text = '';

  // Handle text messages
  if (message.type === 'text') {
    text = message.text.body.trim().toLowerCase();

    if (['hi', 'hii', 'hello', 'வணக்கம்', 'ji'].includes(text)) {
      return sendMenuList(from, 0); // Show first menu
    }

    return sendText(from, 'மன்னிக்கவும். "hi" அனுப்பி மெனு பார்க்கவும்.');
  }

  // Handle interactive responses
  if (message.type === 'interactive') {
    // Button reply (Go to Main Menu)
    if (message.interactive.button_reply) {
      const buttonId = message.interactive.button_reply.id;
      if (buttonId === 'GO_MAIN_MENU') {
        return sendMenuList(from, 0);
      }
    }

    // List reply
    if (message.interactive.list_reply) {
      const listId = message.interactive.list_reply.id;

      // Handle "Next menu"
      if (listId.startsWith('NEXT_MENU_')) {
        const nextIndex = parseInt(listId.split('_')[2]);
        return sendMenuList(from, nextIndex);
      }

      // Handle content replies
      const replyMap = {
        DARISANAM: MESSAGES.DARISANAM,
        ABISHEGAM_TIME: MESSAGES.ABISHEGAM_TIME,
        ABISHEGAM_FEES: MESSAGES.ABISHEGAM_FEES,
        KATTANA_FEES: MESSAGES.KATTANA_FEES,
        PRARTHANA: MESSAGES.PRARTHANA,
        PRASADHA: MESSAGES.PRASADHA,
        ANNADHANAM: MESSAGES.ANNADHANAM,
        NANKODAI: MESSAGES.NANKODAI,
        MUDIKANIKAI: MESSAGES.MUDIKANIKAI,
        PARKING: MESSAGES.PARKING,
        MARRIAGE: MESSAGES.MARRIAGE,
      };

      if (replyMap[listId]) {
        await sendPaginatedText(from, replyMap[listId]);
        return sendMessageWithMainMenu(from, '🔙 முதன்மை மெனுவிற்கு திரும்ப கீழே உள்ள பொத்தானை அழுத்தவும்.');
      }

      return sendText(from, 'மன்னிக்கவும். சரியான விருப்பத்தைத் தேர்வு செய்யவும்.');
    }
  }

  return sendText(from, 'மன்னிக்கவும். சரியான விருப்பத்தைத் தேர்வு செய்யவும்.');
};
