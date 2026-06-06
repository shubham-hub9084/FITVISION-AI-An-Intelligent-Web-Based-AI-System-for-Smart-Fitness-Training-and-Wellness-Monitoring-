import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI = null;
let model = null;

if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
  model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
}

export const getGeminiResponse = async (message) => {
  if (!API_KEY || !model) {
    console.warn("No Gemini API key configured, using mock response.");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      text: "I am a FitVision AI Assistant. Please add VITE_GEMINI_API_KEY to your configuration to enable live AI responses. I can help you with workouts, diet plans, and exercise form advice!",
    };
  }

  try {
    const systemPrompt = `You are the official FitVision AI Assistant. FitVision is an advanced AI-powered fitness platform. 
Key Features:
1. **AI Trainer**: Real-time form correction and rep counting using the user's camera.
2. **Personalized Nutrition**: Custom AI-generated meal plans (Veg/Non-Veg) based on activity level.
3. **Progress Dashboard**: Professional tracking of workouts, streaks, and achievements.
4. **BMI Calculator**: Intuitive body mass index calculation with health categories.
If asked "What is FitVision?" or "What do you do?", provide a comprehensive and motivating summary of these features. Keep responses concise, professional, and fitness-focused.`;

    const fullPrompt = `${systemPrompt}\n\nUser Question: ${message}`;
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return { text: response.text() };
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return {
      text: `Sorry, I encountered an error: ${error.message || error.toString()}. Please check your API key and network connection.`,
      error: true,
    };
  }
};
