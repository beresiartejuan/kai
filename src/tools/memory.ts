import { upsertMemory, getMemory, getAllMemories } from "../db/querys";

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
      required: ["key", "value"],
    },
  },
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

export const listMemoriesKeysTool = {
  type: "function",
  function: {
    name: "list_memories_keys",
    description: "Returns a list of all available memory keys. Use this to discover what the agent already knows.",
    parameters: {
      type: "object",
      properties: {},
    },
  },
  execute: async () => {
    try {
      const all = await getAllMemories();
      const keys = all.map(m => m.key);
      return JSON.stringify({
        success: true,
        keys: keys,
      });
    } catch (error) {
      return JSON.stringify({
        success: false,
        message: `Failed to list keys: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  },
};

export const getMemoriesTool = {
  type: "function",
  function: {
    name: "get_memories",
    description: "Retrieves specific memories by their keys.",
    parameters: {
      type: "object",
      properties: {
        keys: {
          type: "array",
          items: { type: "string" },
          description: "List of keys to retrieve (e.g., ['user_name', 'preferred_language']).",
        },
      },
      required: ["keys"],
    },
  },
  execute: async (args: { keys: string[] }) => {
    try {
      const results = await Promise.all(
        args.keys.map(async (key) => {
          const m = await getMemory(key);
          return { key, value: m ? m.value : null, exists: !!m };
        })
      );
      return JSON.stringify({
        success: true,
        memories: results,
      });
    } catch (error) {
      return JSON.stringify({
        success: false,
        message: `Failed to retrieve memories: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  },
};
