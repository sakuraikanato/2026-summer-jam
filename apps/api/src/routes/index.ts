import { Hono } from "hono";
import { supportMessage } from "./support_messages";
import { follow } from "./follows";
import { userAuth } from "@/middlwere/userAuth";
import { music } from "./music";

export const appRoute = new Hono()
.route("support_messages", supportMessage)
.route("follows", follow)
.route("music", music)
