import { Hono } from "hono";
import { music } from "./music";
import { me } from "./me";
import { follows } from "./follows";
import { members } from "./members";

export const appRoute = new Hono()
.route("/music", music)
.route("/me", me)
.route("/follows", follows)
.route("/members", members)
