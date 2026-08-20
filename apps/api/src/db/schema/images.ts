import { mysqlTable, int, varchar, text, timestamp,  } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const images = mysqlTable("images", {
  id: int("id").primaryKey().autoincrement(),
  imageUrl: varchar("image_url", { length: 255 }).notNull(),
  alt: varchar("alt", { length: 255 }),
  createAt: timestamp("create_at", { mode: "date" }).notNull().defaultNow(),
  updateAt: timestamp("update_at", { mode: "date" }).notNull().defaultNow().$onUpdateFn(() => new Date())
})