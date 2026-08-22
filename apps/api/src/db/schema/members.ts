import { mysqlTable, int, timestamp, foreignKey, unique } from "drizzle-orm/mysql-core";
import { users } from "./auth-schema";

export const members = mysqlTable("members", {
  id: int("id").primaryKey().autoincrement(),
  artistId: int("artist_id").notNull(),
  userId: int("user_id").notNull(),
  joinedMonths: int("joined_months").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdateFn(() => new Date())
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
  }),
  unique("members_artist_user_unique").on(table.artistId, table.userId)
])
