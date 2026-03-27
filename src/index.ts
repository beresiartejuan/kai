import { intro, outro, textPrompt, spinner, note } from "./core/prompts";
import { ChatHistory } from "./core/history";
import { generateResponse, processToolCalls } from "./core/ai";

async function main() {
  intro("🤖 Kai AI - Terminal Assistant");

  const history = new ChatHistory();
  await history.init();

  while (true) {
    const userInput = await textPrompt("You:", "Type your message or 'exit' to quit...");

    if (userInput.toLowerCase() === "exit" || userInput.toLowerCase() === "salir") {
      outro("Goodbye! 👋");
      break;
    }

    await history.push("user", userInput);

    spinner.start("Thinking...");

    try {
      let messagesForAI = history.getMessagesForAI();
      let response = await generateResponse(messagesForAI);

      while (response.message.tool_calls && response.message.tool_calls.length > 0) {
        spinner.message("Executing tools...");
        const toolResults = await processToolCalls(response.message.tool_calls);
        
        messagesForAI.push(response.message);
        messagesForAI.push(...toolResults as any);

        response = await generateResponse(messagesForAI);
      }

      spinner.stop("Done!");

      const assistantContent = response.message.content;
      if (assistantContent) {
        note(assistantContent, "Assistant");
        await history.push("assistant", assistantContent);
      }
    } catch (error) {
      spinner.stop("Error occurred");
      note(error instanceof Error ? error.message : String(error), "Error");
    }
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
