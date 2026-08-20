import { Hono } from "hono";
import { supportMessage } from "./support_messages";
import { post } from "./posts";

export const appRoute = new Hono()
.route("support_messages", supportMessage)
.route("posts", post)