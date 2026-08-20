import { mysqlTable, int, varchar, text, timestamp,  } from "drizzle-orm/mysql-core";
import { users } from "./auth-schema";
import { foreignKey, unique } from "drizzle-orm/mysql-core";


export const follows = mysqlTable("follows", {
  id: int("id").primaryKey().autoincrement(),
  userFrom: int("user_from").notNull(),
  userTo: int("user_to").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatesAt: timestamp("updated_at").notNull().defaultNow().$onUpdateFn(() => new Date())
}, (table) => [
  foreignKey({
    name: "follow_from_fk",
    columns: [table.userFrom],
    foreignColumns: [users.id]
  }).onDelete("cascade"),
  foreignKey({
    name: "follow_to_FK",
    columns: [table.userTo],
    foreignColumns: [users.id]
  }).onDelete("cascade"),
  unique("follow_unique").on(table.userFrom, table.userTo)
])