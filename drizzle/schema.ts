// drizzle/schema.ts
import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  projectName: varchar("project_name", { length: 255 }).notNull(),
  connectionString: text("connection_string").notNull(),
});
