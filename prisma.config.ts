// prisma.config.ts
import "dotenv/config";
import { defineConfig } from "prisma/config";
import {process} from "std-env";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});