import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";

if (process.env.NODE_ENV !== "production") {
  config({ path: ".env" });
  config({ path: ".env.development", override: true });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prismaClient: PrismaClient | undefined;

export function getPrisma(): PrismaClient {
  if (prismaClient) return prismaClient;
  if (globalForPrisma.prisma) {
    prismaClient = globalForPrisma.prisma;
    return prismaClient;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const { PrismaNeon } = require("@prisma/adapter-neon");
  const adapter = new PrismaNeon({ connectionString });
  prismaClient = new PrismaClient({ adapter });
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prismaClient;
  return prismaClient;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrisma();
    return (client as unknown as Record<string, unknown>)[prop as string];
  },
});