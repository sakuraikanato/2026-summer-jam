import { mysqlTable, int, varchar, text } from "drizzle-orm/mysql-core";
import { images } from "./images";
import { users } from "./auth-schema";

export const posts = mysqlTable("posts", {
  id: int("id").primaryKey().autoincrement(),
  content: text("text"),
  userId: int("user_id").notNull().references(() => users.id),
  imageId: int("image_id").references(() => images.id)
})