const fetch = require('node-fetch');
require('dotenv').config();

async function listModels() {
  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models', {
    headers: {
      'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,
    }
  });

  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

listModels();
