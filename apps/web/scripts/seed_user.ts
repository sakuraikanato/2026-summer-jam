import { authClient } from "@/lib/auth";

console.log("test")

await authClient.signUp.email({
  email: "user@example.com",
  password: "securepassword",
  name: "John Doe",
  role: "user",
  point: 0,
  description: "a"
})
await authClient.signUp.email({
  email: "user1@example.com",
  password: "securepassword",
  name: "kanato",
  role: "user",
  point: 0,
  description: "a"
})
await authClient.signUp.email({
  email: "user2@example.com",
  password: "securepassword",
  name: "suipa",
  role: "user",
  point: 0,
  description: "a"
})

await authClient.signUp.email({
  email: "user3@example.com",
  password: "securepassword",
  name: "raa",
  role: "user",
  point: 0,
  description: "a"
})

await authClient.signUp.email({
  email: "user4@example.com",
  password: "securepassword",
  name: "John Doe",
  role: "user",
  point: 0,
  description: "a"
})

const { data, error } = await authClient.signIn.email({
  email: "user@example.com",
  password: "securepassword"
})


console.log(data, error)