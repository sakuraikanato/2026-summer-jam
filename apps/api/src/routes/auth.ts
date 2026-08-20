import { Hono } from "hono";
import { userAuth } from "@/middlwere/userAuth";
import { AuthVariables } from "@/lib/auth";
import db from "../db";
import { follows } from "../db/schema";
import { ApiResponse } from "@/lib/responseType";

export const auth = new Hono<{ Variables: AuthVariables }>()

