require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const webhookRoutes = require('./routes/webhookRoutes');

const app = express();
app.use(bodyParser.json());

// ✅ Simple keep-alive route
app.get('/ping', (req, res) => {
  res.status(200).send('✅ Bot is alive');
});

// Routes
app.use('/webhook', webhookRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
