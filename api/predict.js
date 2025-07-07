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
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Use supported model

    const prompt = `A teen says: "${scenario}"\nGive a funny, playful prediction about what might happen next. Add a percentage chance, emoji, and a touch of drama.`;
    const result = await model.generateContent(prompt);
    const prediction = result.response.text();

    res.status(200).json({ prediction });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to get prediction from Gemini" });
  }
}
