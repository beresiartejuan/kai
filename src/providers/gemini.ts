import { GoogleGenAI } from "@google/genai";

export const googleIA = new GoogleGenAI({ 
  apiKey: process.env.GOOGLE_API_KEY || "" 
});

export const geminiModel = "gemini-2.5-flash";
