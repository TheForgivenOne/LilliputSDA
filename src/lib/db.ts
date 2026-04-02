import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const dbUrl = process.env.DATABASE_URL || "";
  
  if (dbUrl.startsWith("postgresql://") || dbUrl.startsWith("postgres://") || process.env.NODE_ENV === "production") {
    // During build, we might not have a real connection string, but we must use Neon adapter
    // because schema.prisma says provider = "postgresql"
    const adapter = new PrismaNeon({ connectionString: dbUrl || "postgres://localhost:5432/db" }) as any;
    return new PrismaClient({ adapter });
  }
  
  const adapter = new PrismaLibSql({ url: dbUrl || "file:./prisma/dev.db" });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;