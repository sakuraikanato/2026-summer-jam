import { mysqlTable, int, varchar, text, timestamp } from "drizzle-orm/mysql-core";
import { users } from "./auth-schema";

export const pointLogs = mysqlTable("point_logs", {
  id: int("id").primaryKey().autoincrement(),
  from: int("from").notNull().references(() => users.id),
  to: int("to").notNull().references(() => users.id),
  createAt: timestamp("create_at", { mode: "date" }).notNull().defaultNow(),
  updateAt: timestamp("update_at", { mode: "date" }).notNull().defaultNow().$onUpdateFn(() => new Date())
})