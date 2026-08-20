import { mysqlTable, int, varchar, text, timestamp } from "drizzle-orm/mysql-core";
import { images } from "./images";
import { entities } from "./entities";

export const posts = mysqlTable("posts", {
  id: int("id").primaryKey().autoincrement(),
  content: text("text"),
  entityId: int("entity_id").notNull().references(() => entities.id),
  imageId: int("image_id").references(() => images.id),
  createAt: timestamp("create_at", { mode: "date" }).notNull().defaultNow(),
  updateAt: timestamp("update_at", { mode: "date" }).notNull().defaultNow().$onUpdateFn(() => new Date())
})