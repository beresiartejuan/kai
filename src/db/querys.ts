import { db } from "./index";
import { messages, tags, messageTags, memories } from "./tables";
import { eq, desc, and } from "drizzle-orm";

/** --- Mensajes --- **/

export async function addMessage(data: typeof messages.$inferInsert) {
  return await db.insert(messages).values(data).returning();
}

export async function getMessages(limit = 50) {
  return await db.select().from(messages).orderBy(desc(messages.timestamp)).limit(limit);
}

export async function getMessageById(id: string) {
  const result = await db.select().from(messages).where(eq(messages.id, id));
  return result[0];
}

export async function deleteMessage(id: string) {
  return await db.delete(messages).where(eq(messages.id, id));
}

/** --- Etiquetas (Tags) --- **/

export async function addTag(name: string) {
  return await db.insert(tags).values({ name }).onConflictDoNothing().returning();
}

export async function getTags() {
  return await db.select().from(tags);
}

export async function attachTagToMessage(messageId: string, tagName: string) {
  // 1. Asegurar que el tag existe
  const tagResult = await addTag(tagName);
  let tagId: number;

  if (tagResult.length > 0) {
    tagId = tagResult[0]!.id;
  } else {
    const existing = await db.select().from(tags).where(eq(tags.name, tagName));
    tagId = existing[0]!.id;
  }

  // 2. Vincularlo al mensaje
  return await db.insert(messageTags).values({ messageId, tagId }).onConflictDoNothing();
}

export async function getMessagesWithTags() {
  const allMessages = await db.select().from(messages).orderBy(desc(messages.timestamp));
  
  // Nota: Drizzle permite joins, pero para este caso simple podemos mapear
  // Si se requiere algo más complejo, usar relational queries si se configuran en el index.ts
  const results = await Promise.all(
    allMessages.map(async (msg) => {
      const msgTags = await db
        .select({ name: tags.name })
        .from(messageTags)
        .innerJoin(tags, eq(messageTags.tagId, tags.id))
        .where(eq(messageTags.messageId, msg.id));
      
      return { ...msg, tags: msgTags.map(t => t.name) };
    })
  );

  return results;
}

/** --- Memorias --- **/

export async function upsertMemory(key: string, value: string, confidence?: number) {
  const existing = await db.select().from(memories).where(eq(memories.key, key));
  
  if (existing.length > 0) {
    return await db
      .update(memories)
      .set({ value, confidence, updated_at: Math.floor(Date.now() / 1000) })
      .where(eq(memories.key, key))
      .returning();
  } else {
    return await db
      .insert(memories)
      .values({ key, value, confidence, updated_at: Math.floor(Date.now() / 1000) })
      .returning();
  }
}

export async function getMemory(key: string) {
  const result = await db.select().from(memories).where(eq(memories.key, key));
  return result[0];
}

export async function getAllMemories() {
  return await db.select().from(memories);
}
