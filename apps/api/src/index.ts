import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { ApiResponse } from '../lib/responseType';
import { appRoute } from './routes';
import { auth } from '../lib/auth';
import { serveStatic } from 'hono/bun';

const port = Number(process.env.API_PORT);

console.log(process.env.FRONT_URL)

const app = new Hono()

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
.onError((err, c) => {
  return c.json<ApiResponse<null>>({
    success: false,
    error: {
      message: err
    }
  }, 400)
})

export type AppType = typeof app
export default {
  port: port,
  fetch: app.fetch,
}
