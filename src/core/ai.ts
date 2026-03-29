import * as providers from "../providers";
import * as tools from "../tools";

// Contador para alternar modelos
let callCount = 0;

export async function generateResponse(messages: any[]) {
  const useMain = callCount % 2 === 0;
  callCount++;

  const availableTools = Object.values(tools).map(t => ({
    type: t.type,
    function: t.function
  }));

  if (useMain) {
    // Principal: Ollama
    return await providers.ollama.chat({
      model: providers.models.main,
      messages,
      tools: availableTools as any,
    });
  } else {
    // Secundario: OpenRouter
    const response = await providers.openRouter.chat.completions.create({
      model: providers.openRouterModel,
      messages: messages as any,
      tools: availableTools as any,
    });
    
    // Adaptamos el formato de OpenRouter (OpenAI) al de Ollama para mantener consistencia
    return {
      message: response.choices[0]!.message
    };
  }
}

export async function summarizeText(text: string): Promise<string> {
  try {
    const response = await providers.ollama.generate({
      model: providers.models.resumer,
      prompt: `Resume el siguiente texto en menos de 100 caracteres preservando los datos clave: ${text}`,
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
    const toolArgs = typeof call.function.arguments === 'string' 
      ? JSON.parse(call.function.arguments) 
      : call.function.arguments;

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
