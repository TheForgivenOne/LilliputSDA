import { defineConfig } from "prisma/config";
import { config } from "dotenv";

config({ path: ".env" });
config({ path: ".env.development" });
config({ path: ".env.production" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
