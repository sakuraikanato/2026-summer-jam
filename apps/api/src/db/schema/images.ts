import { mysqlTable, int, varchar, text } from "drizzle-orm/mysql-core";

export const images = mysqlTable("images", {
  id: int("id").primaryKey().autoincrement(),
  imageUrl: varchar("image_url", { length: 255 }).notNull(),
  alt: varchar("alt", { length: 255 }),
})