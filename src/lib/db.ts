import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const connectionString = process.env.DATABASE_URL 
  || "postgresql://neondb_owner:npg_gKhZVQY5oB3u@ep-morning-haze-amtgrz1f-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

function createPrismaClient() {
  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
