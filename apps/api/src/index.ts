import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { ApiResponse } from '../lib/responseType';
import { appRoute } from './routes';
import { auth } from '../lib/auth';
import type { AuthVariables } from '../lib/auth';
import { serveStatic } from 'hono/bun';
import { HTTPException } from 'hono/http-exception';

const port = Number(process.env.API_PORT);

console.log(process.env.FRONT_URL)

const app = new Hono<{ Variables: AuthVariables }>()

.use("*", cors({
  origin: process.env.FRONT_URL ?? "http://localhost:3000",
  credentials: true
}))
.get('/', (c) => {
  return c.text('Hello Hono!')
})
.route("api/", appRoute)
.on(
  ["POST", "GET"],
  "/api/auth/*",
  (c) => auth.handler(c.req.raw)
)
.use(
  "/uploads/*",
  serveStatic({
    root: "./public",
  }),
)
.notFound((c) => {
  return c.json<ApiResponse<string>>({
    success: false,
    error: "Not Found"
  }, 404)
})
.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json<ApiResponse<HTTPException>>({
      success: false,
      error: err
    }, err.status)
  }
  return c.json<ApiResponse<typeof err>>({
    success: false,
    error: err
  }, 400)
})

export type AppType = typeof app
export default {
  port: port,
  fetch: app.fetch,
}
