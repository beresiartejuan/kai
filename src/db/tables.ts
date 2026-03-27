import { integer, real, sqliteTable, text, primaryKey } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const messages = sqliteTable("messages", {
  id: text("id", { length: 17 }).primaryKey().notNull(),
  content: text("content").notNull(),
  role: text("role").notNull(), // 'user', 'assistant', 'system'
  timestamp: integer("timestamp").notNull(), // Usar el timestamp de SQLite
  summary: text("summary"), // Opcional: para guardar un resumen corto del mensaje
});

export const insertMessageSchema = createInsertSchema(messages);
export const selectMessageSchema = createSelectSchema(messages);
export const updateMessageSchema = createSelectSchema(messages);

export const tags = sqliteTable("tags", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
  name: text("name").unique().notNull(),
});

export const insertTagSchema = createInsertSchema(tags);
export const selectTagSchema = createSelectSchema(tags);
export const updateTagSchema = createSelectSchema(tags);

export const messageTags = sqliteTable("message_tags", {
    messageId: text("message_id")
      .notNull()
      .references(() => messages.id, { onDelete: "cascade" }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => ([
    primaryKey({ columns: [table.messageId, table.tagId] })
  ])
);

export const insertMessageTagsSchema = createInsertSchema(messageTags);
export const selectMessageTagsSchema = createSelectSchema(messageTags);
export const updateMessageTagsSchema = createSelectSchema(messageTags);

export const memories = sqliteTable("memories", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
  key: text("key").notNull(), // ej: 'preferencia_css'
  value: text("value").notNull(), // ej: 'tailwind'
  confidence: real("confidence"), // Que tan seguro está el agente de este dato (0.0 a 1.0)
  updated_at: integer("updated_at"),
});

export const insertMemorySchema = createInsertSchema(memories);
export const selectMemorySchema = createSelectSchema(memories);
export const updateMemorySchema = createSelectSchema(memories);