import { Hono } from "hono";
import { music } from "./music";

export const appRoute = new Hono()
.route("music", music)
