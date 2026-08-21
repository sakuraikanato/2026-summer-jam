import { mysqlTable, int, varchar, text, timestamp, foreignKey } from "drizzle-orm/mysql-core";
import { users } from "./auth-schema";

export const members = mysqlTable("members", {
  id: int("id").primaryKey().autoincrement(),
  artistId: int("artist_id").notNull(),
  userId: int("user_id").notNull()
}, (table) => [
  foreignKey({
    name: "artist_FK",
    columns: [table.artistId],
    foreignColumns: [users.id]
  }),
  foreignKey({
    name: "user_FK",
    columns: [table.userId],
    foreignColumns: [users.id]
  })
])