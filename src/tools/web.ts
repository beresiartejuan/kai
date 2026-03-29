import { tavi } from "../providers/tavily";

export const webSearchTool = {
  type: "function",
  function: {
    name: "web_search",
    description: "Search the web for real-time information, news, or specific questions.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The search query to look up.",
        },
      },
      required: ["query"],
    },
  },
  execute: async (args: { query: string }) => {
    try {
      const response = await tavi.search(args.query, {
        searchDepth: "fast",
        maxResults: 6,
        includeAnswer: "advanced"
      });

      // CLEANING: Solo pasamos los datos relevantes (sin IDs de request ni metadatos pesados)
      const cleanedResults = response.results.map(r => ({
        title: r.title,
        url: r.url,
        content: r.content
      }));

      return JSON.stringify({
        success: true,
        answer: response.answer,
        results: cleanedResults
      });
    } catch (error) {
      return JSON.stringify({
        success: false,
        message: `Search failed: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  },
};
