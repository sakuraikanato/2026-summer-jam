import { authClient } from "@/lib/auth";

console.log("test")

const { error, data } = await authClient.signUp.email({
  email: "user@example.com",
  password: "securepassword",
  name: "John Doe",
  role: "user",
  point: 0,
  description: "a"
})

console.log(data, error)