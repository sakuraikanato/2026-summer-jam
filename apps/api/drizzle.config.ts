import { defineConfig } from "drizzle-kit";

export default defineConfig({
	dialect: "mysql",
	schema: "./src/db/schema",
	out: "./src/db/drizzle",
	dbCredentials: {
		user: process.env.DB_USER || "root",
		password: process.env.DB_PASSWORD || "pass",
		host: String(process.env.DB_HOST) || "localhost",
		port: Number(process.env.DB_PORT) || 3306,
		database: String(process.env.DB_NAME || "summer-jam"),
	},
});
