import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const dbUrl = process.env.DATABASE_URL;

  // Default fallback if no DATABASE_URL is provided
  if (!dbUrl) {
    // If we're in a build or CI environment without a DB, we still need a valid PrismaClient.
    // In Prisma 7+, when using driver adapters, providing a compatible adapter satisfies
    // the requirement for a valid configuration during static analysis and build time.
    const adapter = new PrismaNeon({ connectionString: "postgresql://localhost/dummy" });
    return new PrismaClient({ adapter });
  }
  
  if (dbUrl.startsWith("postgresql://") || dbUrl.startsWith("postgres://")) {
    const adapter = new PrismaNeon({ connectionString: dbUrl });
    return new PrismaClient({ adapter });
  }
  
  if (dbUrl.startsWith("libsql://") || dbUrl.startsWith("file:")) {
    const adapter = new PrismaLibSql({ url: dbUrl });
    return new PrismaClient({ adapter });
  }

  // Fallback to a standard client for other database types
  return new PrismaClient();
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;