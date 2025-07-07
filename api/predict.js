import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST method allowed" });
  }

  const { scenario } = req.body;
  if (!scenario) {
    return res.status(400).json({ error: "No scenario provided" });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are a playful teen life predictor. A user has submitted the following scenario: "${scenario}".

Respond in the following JSON format ONLY:

{
  "scenario": "<input scenario>",
  "predictions": [
    {
      "outcome": "<short outcome>",
      "probability": <percent as number>,
      "emoji": "<one emoji>",
      "reasoning": "<funny, playful reasoning>"
    },
    ...
  ]
}

Give 3 predictions, each with a unique outcome. Make the reasoning insightful and fun.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Try to safely parse JSON from Gemini's text
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON found in response");

    const parsed = JSON.parse(match[0]);

    // Sort predictions by probability
    parsed.predictions.sort((a, b) => b.probability - a.probability);
    const mostLikely = parsed.predictions[0];
    const secondMostLikely = parsed.predictions[1];

    res.status(200).json({
      scenario: parsed.scenario,
      predictions: parsed.predictions,
      mostLikely,
      secondMostLikely,
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to get structured prediction from Gemini" });
  }
}
