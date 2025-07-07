const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const { OpenAI } = require('openai');

const app = express();
const PORT = 5001;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));
app.use(bodyParser.json());

app.options('/*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.sendStatus(204);
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/predict', async (req, res) => {
  const { scenario } = req.body;
  if (!scenario) return res.status(400).json({ error: 'No scenario provided' });

  try {
    const prompt = `A teen says: "${scenario}"\nGive a funny, playful prediction about what might happen next. Add a percentage chance, emoji, and a touch of drama.`;

    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 60,
      temperature: 0.8,
    });

    const prediction = chatCompletion.choices[0].message.content.trim();
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.json({ prediction });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ error: 'Failed to get prediction from OpenAI' });
  }
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
