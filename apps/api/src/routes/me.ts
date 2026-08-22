import type { AuthVariables } from "../..//lib/auth";
import { ApiResponse } from "../..//lib/responseType";
import { userAuth } from "../..//middlwere/userAuth";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

export const me = new Hono<{ Variables: AuthVariables }>()

.use(userAuth)
.get("/", (c) => {
  const user = c.get("user")

  console.log(user);
  if (!user) throw new HTTPException(401, {message: "User Not Found"});
  
  return c.json<ApiResponse<typeof user>>({
    success: true,
    data: user
  })

})