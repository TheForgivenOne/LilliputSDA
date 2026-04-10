import { defineConfig } from "prisma/config";

const dbUrl = process.env.DATABASE_URL 
  || "postgresql://neondb_owner:npg_gKhZVQY5oB3u@ep-morning-haze-amtgrz1f-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: dbUrl,
  },
});
