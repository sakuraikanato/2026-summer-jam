import { mysqlTable, int, varchar, text, timestamp } from "drizzle-orm/mysql-core";
import { entities } from "./entities";

export const supportMessages = mysqlTable("support_messages", {
  id: int("id").primaryKey().autoincrement(),
  entityId: int("entity_id").notNull().references(() => entities.id),
  content: text("content").notNull().default("応援してます"),
  createAt: timestamp("create_at", { mode: "date" }).notNull().defaultNow(),
  updateAt: timestamp("update_at", { mode: "date" }).notNull().defaultNow().$onUpdateFn(() => new Date())
})