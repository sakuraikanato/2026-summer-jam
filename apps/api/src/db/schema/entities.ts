import { ownerAc } from "better-auth/plugins/organization/access";
import { mysqlTable, int, varchar, text, timestamp, foreignKey } from "drizzle-orm/mysql-core";
import { users } from "./auth-schema";

export const entities = mysqlTable("entities", {
  id: int("id").primaryKey().autoincrement(),
  ownerId: int("owner_id").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  calledName: varchar("called_name", { length: 255 }),
  icon: varchar("icon", { length: 255 }),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatesAt: timestamp("updated_at").notNull().defaultNow().$onUpdateFn(() => new Date())
}, (table) => [
  foreignKey({
    name: "owner_FK",
    columns: [table.ownerId],
    foreignColumns: [users.id]
  }).onDelete("cascade")
])