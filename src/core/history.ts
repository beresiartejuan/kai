import { addMessage, getMessages } from "../db/querys";
import { messages as messagesTable } from "../db/tables";
import { summarizeText } from "./ai";

type InsertMessage = typeof messagesTable.$inferSelect; // Correction: should be $inferInsert but match table types

export class ChatHistory {
  private cache: any[] = []; // Flexible cache for InsertMessage
  private readonly MAX_CACHE = 30;

  async init() {
    const lastMessages = await getMessages(this.MAX_CACHE);
    this.cache = lastMessages.reverse().map(m => ({
      id: m.id,
      content: m.content,
      role: m.role,
      timestamp: m.timestamp,
      summary: m.summary
    }));
  }

  async push(role: "user" | "assistant" | "system", content: string) {
    let summary: string | null = null;
    
    if (content.length > 500) {
      summary = await summarizeText(content);
    }

    const newMessage = {
      id: Math.random().toString(36).substring(2, 17), 
      role,
      content,
      timestamp: Math.floor(Date.now() / 1000),
      summary
    };

    await addMessage(newMessage);

    this.cache.push(newMessage);
    if (this.cache.length > this.MAX_CACHE) {
      this.cache.shift();
    }
  }

  getMessagesForAI() {
    return this.cache.slice(-15).map(m => ({
      role: m.role,
      content: m.content
    }));
  }
}
