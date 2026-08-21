import { mysqlTable, int, varchar, text, timestamp, foreignKey } from "drizzle-orm/mysql-core";
import { users } from "./auth-schema";
import { musicFiles } from "./musicFiles";

export const musics = mysqlTable("musics", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 255}).notNull(),
  iconUrl: varchar("icon_url", { length: 255 }).notNull(),
  artistId: int("artist_id").notNull().references(() => users.id),
  otherArtistId: int("other_artist_id").references(() => users.id),
  fileId: int("file_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdateFn(() => new Date())
}, (table) => [
  foreignKey({
    name: "file_FK",
    columns: [table.fileId],
    foreignColumns: [musicFiles.id]
  })
])
