import { Ollama } from "ollama";
import * as tools from "../tools";

const ollama = new Ollama();
// Main model (Cloud-based via Ollama)
const MAIN_MODEL = "gpt-oss:20b-cloud"; 
// Local model for summarization
const SUMMARY_MODEL = "gemma3:1b";

export async function generateResponse(messages: any[]) {
  const availableTools = Object.values(tools).map(t => ({
    type: t.type,
    function: t.function
  }));

  const response = await ollama.chat({
    model: MAIN_MODEL,
    messages,
    tools: availableTools as any,
  });

  return response;
}

export async function summarizeText(text: string): Promise<string> {
  try {
    const response = await ollama.generate({
      model: SUMMARY_MODEL,
      prompt: `Summarize the following text in less than 300 characters: ${text}`,
      stream: false
    });
    return response.response.trim();
  } catch (error) {
    console.error("Summarization error:", error);
    return text.substring(0, 100) + "...";
  }
}

export async function processToolCalls(toolCalls: any[]) {
  const toolResults = [];

  for (const call of toolCalls) {
    const toolName = call.function.name;
    const toolArgs = call.function.arguments;

    const tool = Object.values(tools).find(t => t.function.name === toolName);

    if (tool && "execute" in tool) {
      const result = await (tool as any).execute(toolArgs);
      toolResults.push({
        role: "tool",
        content: result,
      });
    }
  }

  return toolResults;
}
