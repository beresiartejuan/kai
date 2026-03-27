import { upsertMemory } from "../db/querys";

export const createMemoryTool = {
  type: "function",
  function: {
    name: "create_memory",
    description: "Saves or updates a piece of information (memory) about the user or the context to be remembered in future conversations.",
    parameters: {
      type: "object",
      properties: {
        key: {
          type: "string",
          description: "A unique identifier for the memory (e.g., 'user_name', 'favorite_color', 'coding_preference').",
        },
        value: {
          type: "string",
          description: "The actual information to remember.",
        },
        confidence: {
          type: "number",
          description: "How certain the agent is about this information, from 0.0 (not sure) to 1.0 (certain).",
          minimum: 0,
          maximum: 1,
        },
      },
      required: ["key", "value", "confidence"],
    },
  },
  // Function to be called when the model decides to use this tool
  execute: async (args: { key: string; value: string; confidence?: number }) => {
    try {
      const result = await upsertMemory(args.key, args.value, args.confidence);
      return JSON.stringify({
        success: true,
        message: `Memory '${args.key}' saved successfully.`,
        data: result,
      });
    } catch (error) {
      return JSON.stringify({
        success: false,
        message: `Failed to save memory: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  },
};
