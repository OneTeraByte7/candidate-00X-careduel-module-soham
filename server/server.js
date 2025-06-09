require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigin = process.env.FRONTEND_URL || '*';

app.use(cors({ origin: allowedOrigin }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('CareDuel backend is running.');
});

app.post('/api/suggest-topic', async (req, res) => {
  try {
    const { topic, userEmail } = req.body;

    if (!topic || !userEmail) {
      return res.status(400).json({ error: 'Topic and userEmail are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY;
    const MAILERLITE_GROUP_ID = process.env.MAILERLITE_GROUP_ID;

    if (!MAILERLITE_API_KEY || !MAILERLITE_GROUP_ID) {
      return res.status(500).json({ error: 'MailerLite API key or Group ID not configured' });
    }

    // Create subscriber and assign group at the same time
    const subscriberResponse = await axios.post(
      'https://connect.mailerlite.com/api/subscribers',
      {
        email: userEmail,
        fields: {
          topic_suggestion: topic,
        },
        groups: [MAILERLITE_GROUP_ID],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${MAILERLITE_API_KEY}`,
        },
      }
    );

    return res.json({ message: 'Topic suggested and subscriber added successfully!' });
  } catch (error) {
    if (error.response) {
      console.error('MailerLite API error response:', error.response.status, error.response.data);
      return res.status(error.response.status).json({ error: error.response.data || 'MailerLite API error' });
    } else {
      console.error('MailerLite API error:', error.message);
      return res.status(500).json({ error: 'Failed to suggest topic' });
    }
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
