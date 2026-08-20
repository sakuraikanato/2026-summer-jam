import { authClient } from "@/lib/auth";

console.log("test")

const { data, error } = await authClient.signUp.email({
  email: "user@example.com",
  password: "securepassword",
  name: "John Doe",
  role: "user",
  description: "a"
})
await authClient.signUp.email({
  email: "user1@example.com",
  password: "securepassword",
  name: "kanato",
  role: "user",
  description: "a"
})
await authClient.signUp.email({
  email: "user2@example.com",
  password: "securepassword",
  name: "suipa",
  role: "user",
  description: "a"
})

await authClient.signUp.email({
  email: "user3@example.com",
  password: "securepassword",
  name: "raa",
  role: "user",
  description: "a"
})

await authClient.signUp.email({
  email: "user4@example.com",
  password: "securepassword",
  name: "John Doe",
  role: "user",
  description: "a"
})

await authClient.signIn.email({
  email: "user@example.com",
  password: "securepassword"
})


console.log(data, error)