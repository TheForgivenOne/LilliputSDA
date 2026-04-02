import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { Pool } from "@neondatabase/serverless";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const dbUrl = process.env.DATABASE_URL || "postgres://localhost:5432/db";
  
  if (dbUrl.startsWith("postgresql://") || dbUrl.startsWith("postgres://")) {
    const pool = new Pool({ connectionString: dbUrl });
    const adapter = new PrismaNeon(pool as any);
    return new PrismaClient({ adapter });
  }
  
  const adapter = new PrismaLibSql({ url: dbUrl || "file:./prisma/dev.db" });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;