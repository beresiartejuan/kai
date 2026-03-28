import { Ollama, type ChatRequest } from "ollama"
import { OpenRouter } from '@openrouter/sdk';
import { GoogleGenAI } from "@google/genai";
import { tavily, type TavilySearchOptions } from "@tavily/core";

export const ollama = new Ollama();

export const openRouter = new OpenRouter({
  apiKey: '<OPENROUTER_API_KEY>',
});


// La api key de gemini se saca por medio de las ENVs
export const gemini = new GoogleGenAI({});

export const tavi = tavily({ apiKey: '<api key>' });

export const main_model = async (data: ChatRequest & { stream: true }) => {
    return await ollama.chat({
        ...data,
        model: 'gpt-oss:20b-cloud'
    });
}

export const resumer = async (data: ChatRequest & { stream: true }) => {
    return await ollama.chat({
        ...data,
        model: 'gemma3:1b'
    });
}

export const internet = async (query: string, options: TavilySearchOptions) => {
    // TODO: Esto tiene un limite de 900 busquedas al mes. Cuando el modelo se sobrepase se debe negar el acceso amablemente (no con un error tosco).
    const response = await tavi.search(query, options);

    return {
        response: response.answer,
        query: query,
        pages: response.results,
        requestId: response.requestId
    }
}

export const gemini2_5 = () => {}