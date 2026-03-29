import { OpenAI } from "openai";

export const openRouter = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY || '<OPENROUTER_API_KEY>',
});

export const openRouterModel = "openai/gpt-oss-20b:free";
