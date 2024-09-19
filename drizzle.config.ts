import { defineConfig } from "drizzle-kit";
import { loadEnvConfig } from "@next/env";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

export default defineConfig({
  schema: "./drizzle/schema.ts", // Path to your schema file
  dialect: "postgresql", // Define PostgreSQL as the dialect
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
