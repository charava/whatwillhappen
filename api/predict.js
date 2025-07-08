import { GoogleGenerativeAI } from "@google/generative-ai";



// violence, self harm, abuse, sexual, bullying, hate speech, illegal activities, personal data, misinformation, spam, harassment, discrimination, explicit content, sensitive topics, political content, medical advice
// These are the categories that the AI should not generate content for.



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

    const models = [
    "gemini-2.0-flash-lite",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
    "gemini-1.5-pro"
    ];
    
    let selectedModel = null;
    
    models.some(model => {
    try {
        if (genAI.getGenerativeModel({ model })) {
        selectedModel = model;
        return true; // Break the loop once a valid model is found
        }
    } catch (error) {
        console.warn(`Model ${model} is not available:`, error.message);
        return false; // Continue to the next model
    }
    });
    
    if (!selectedModel) {
    throw new Error("No supported models are available with your API key");
    }
    const model = genAI.getGenerativeModel(
        { model: selectedModel },
        
      );
    
    // const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" }); 

    const prompt = `
    You are a playful Gen-Z teen life predictor and close friend. A user has submitted the following scenario: "${scenario}".
    
    Do not generate content related to the following categories: 
    - Suicide or self-harm
    - Violence or harm to others
    - Abuse (physical, emotional, sexual)
    - Sexual content or misconduct
    - Bullying or harassment
    - Hate speech or discrimination
    - Illegal activity
    - Personal/confidential information
    - Misinformation or spam
    - Explicit content
    - Medical or legal advice
    - Sensitive political topics
    
    If the scenario involves any of these categories, respond ONLY with the following JSON content:
    
    {
      "scenario": "Scenario contains prohibited content."
      "prediction": {
        "outcome": "",
        "probability": "",
        "reasoning": ""
      }
    }

    Sorry, your situation does not follow our safety guidelines. 
    
    Otherwise, respond in the following JSON format ONLY:
    
    {
      "scenario": "<input scenario>",
      "prediction": {
        "outcome": "<short outcome>",
        "probability": <percent as number>,
        "reasoning": "<insightful reasoning>"
      }
    }
    
    Ensure the response adheres to the safety guidelines and does not include any prohibited content.
    `;
//     const prompt = `
// You are a playful teen life predictor. A user has submitted the following scenario: "${scenario}".

// Respond in the following JSON format ONLY:

// {
//   "scenario": "<input scenario>",
//   "prediction": {
//     "outcome": "<short outcome>",
//     "probability": <percent as number>,
//     "reasoning": "<insightful reasoning>"
//   }
// }

// Provide only one prediction with a single outcome, a probability score, and reasoning insight.
// `;

const result = await model.generateContent(prompt);
const text = result.response.text();

// Try to safely parse JSON from Gemini's text
const match = text.match(/\{[\s\S]*\}/);
if (!match) throw new Error("No JSON found in response");

const parsed = JSON.parse(match[0]);

res.status(200).json({
  scenario: parsed.scenario,
  prediction: parsed.prediction,
});
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to get structured prediction from Gemini" });
  }
}
