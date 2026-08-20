import { Hono } from "hono";
import { supportMessage } from "./support_messages";
import { post } from "./posts";
import { follow } from "./follows";
import { userAuth } from "@/middlwere/userAuth";
import { auth } from "./auth";

export const appRoute = new Hono()
.route("support_messages", supportMessage)
.route("posts", post)
.route("follows", follow)
.use(userAuth)
.route("/auth", auth)