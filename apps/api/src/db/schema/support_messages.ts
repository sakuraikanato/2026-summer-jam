import { mysqlTable, int, varchar, text } from "drizzle-orm/mysql-core";
import { users } from "./auth-schema";

export const support_messages = mysqlTable("support_messages", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull().references(() => users.id),
  content: text("content").notNull().default("応援してます")
})