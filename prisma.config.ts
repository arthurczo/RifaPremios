import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
  //  seed: "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.js",
    seed: "node prisma/seed.js"
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});