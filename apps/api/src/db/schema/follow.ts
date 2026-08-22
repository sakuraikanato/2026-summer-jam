import { mysqlTable, int, timestamp, unique } from "drizzle-orm/mysql-core";
import { users } from "./auth-schema";

export const follows = mysqlTable("follows", {
  id: int("id").primaryKey().autoincrement(),
  fromUserId: int("from_user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  toUserId: int("to_user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdateFn(() => new Date())
}, (table) => [
  unique("follow_unique").on(table.fromUserId, table.toUserId),
]);
