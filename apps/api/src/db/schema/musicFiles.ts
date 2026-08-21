import { mysqlTable, int, varchar, text, timestamp } from "drizzle-orm/mysql-core";

export const musicFiles = mysqlTable("music_files", {
  id: int("id").primaryKey().autoincrement(),
  shortUrl: varchar("short_url", { length: 255 }).notNull(),
  fullUrl: varchar("full_url", { length: 255 }).notNull(),
})