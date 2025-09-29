const express = require('express');
const router = express.Router();
const { handleMessage } = require('../controllers/messageController');

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// Webhook verification (GET)
router.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token && mode === 'subscribe' && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  res.sendStatus(403);
});

// Webhook receive (POST)
router.post('/', async (req, res) => {
  res.sendStatus(200); // always respond quickly

  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const messages = changes?.value?.messages;

    if (messages) {
      for (const msg of messages) {
        await handleMessage(msg);
      }
    }
  } catch (err) {
    console.error('Webhook error:', err.message);
  }
});

module.exports = router;
