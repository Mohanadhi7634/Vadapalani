require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const webhookRoutes = require('./routes/webhookRoutes');

const app = express();
app.use(bodyParser.json());
app.use("/images", express.static("public"));

// Routes
app.use('/webhook', webhookRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
