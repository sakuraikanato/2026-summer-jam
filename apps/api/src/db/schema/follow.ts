import { mysqlTable, int, varchar, text, timestamp,  } from "drizzle-orm/mysql-core";
import { users } from "./auth-schema";
import { foreignKey, unique } from "drizzle-orm/mysql-core";

export const follows = mysqlTable("follows", {
  id: int("id").primaryKey().autoincrement(),
  fromUserId: int("from_user_id").notNull(),
  toArtistId: int("to_artist_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatesAt: timestamp("updated_at").notNull().defaultNow().$onUpdateFn(() => new Date())
}, (table) => [
  foreignKey({
    name: "user_FK",
    columns: [table.fromUserId],
    foreignColumns: [users.id],
  }).onDelete("cascade"),
  foreignKey({
    name: "entity_FK",
    columns: [table.toArtistId],
    foreignColumns: [users.id]
  }).onDelete("cascade"),
  unique("follow_unique").on(table.fromUserId, table.toArtistId)
])