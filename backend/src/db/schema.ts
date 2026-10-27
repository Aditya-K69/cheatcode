// src/db/schema.ts
import {
  pgTable,
  serial,
  integer,
  varchar,
  text,
  jsonb,
} from "drizzle-orm/pg-core";

export const problems = pgTable("problems", {
  id: serial("id").primaryKey(),
  leetcodeId: integer("leetcode_id").unique().notNull(),
  title: text("title").notNull(),
  slug: text("slug").unique().notNull(),
  difficulty: varchar("difficulty", { length: 10 }).notNull(),
  contentHtml: text("content_html").notNull(),
  params: jsonb("params").notNull(), // e.g. [{ name: "nums", type: "integer[]" }]
  testCases: jsonb("test_cases").notNull(), // e.g. [["[2,7,11,15]", "9"], ...]
  hints: jsonb("hints").notNull(),
  snippets: jsonb("snippets").notNull(),
  tags: jsonb("tags").notNull(), // We'll store tags as a simple JSON array for now
});
