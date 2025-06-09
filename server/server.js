// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS to allow only your frontend origin in production
const allowedOrigin = process.env.FRONTEND_URL || '*';
app.use(cors({
  origin: allowedOrigin,
}));

app.use(bodyParser.json());

// Health check route
app.get('/', (req, res) => {
  res.send('CareDuel backend is running.');
});

app.post('/api/suggest-topic', async (req, res) => {
  try {
    const { topic, userEmail } = req.body;

    if (!topic || !userEmail) {
      return res.status(400).json({ error: 'Topic and userEmail are required' });
    }

    // Optional: basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY;
    const MAILERLITE_GROUP_ID = process.env.MAILERLITE_GROUP_ID;

    if (!MAILERLITE_API_KEY || !MAILERLITE_GROUP_ID) {
      return res.status(500).json({ error: 'MailerLite API key or Group ID not configured' });
    }

    // Call MailerLite API to add subscriber with topic suggestion
    await axios.post(
      `https://api.mailerlite.com/api/v2/groups/${MAILERLITE_GROUP_ID}/subscribers`,
      {
        email: userEmail,
        fields: {
          topic_suggestion: topic,
        },
        resubscribe: true,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-MailerLite-ApiKey': MAILERLITE_API_KEY,
        },
      }
    );

    return res.json({ message: 'Topic suggested successfully!' });
  } catch (error) {
    console.error('MailerLite API error:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Failed to suggest topic' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
