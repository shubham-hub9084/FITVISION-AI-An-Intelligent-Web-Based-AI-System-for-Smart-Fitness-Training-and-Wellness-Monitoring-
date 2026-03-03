import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Initialize the API only if the key exists
let genAI = null;
let model = null;

if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
  model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
}

export const getGeminiResponse = async (message) => {
  if (!API_KEY || !model) {
    // Mock response for testing/demo purposes when no API key is provided
    console.warn("No API key found, returning mock response.");
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
    return {
      text: "I am a FitVision AI Assistant (Mock). Please add your Google Gemini API key to the .env file to enable real AI responses. I can help you with workout plans, diet tips, and form correction advice!",
    };
  }

  try {
    const result = await model.generateContent(message);
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
