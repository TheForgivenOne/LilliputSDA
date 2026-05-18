import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { config } from "dotenv";

if (process.env.NODE_ENV !== "production") {
  config({ path: ".env" });
  config({ path: ".env.development", override: true });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getPrismaClient(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  const connectionString = process.env.DATABASE_URL;
  const adapter = new PrismaNeon({ connectionString: connectionString || "" });
  const client = new PrismaClient({ adapter });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }

  return client;
}

function checkDatabaseConfig(): void {
  if (
    !process.env.DATABASE_URL &&
    process.env.NODE_ENV === "production"
  ) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
}

export function getPrisma(): PrismaClient {
  checkDatabaseConfig();
  return getPrismaClient();
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_, prop) {
    return getPrisma()[prop as keyof PrismaClient];
  },
});