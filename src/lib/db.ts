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

let prismaClient: PrismaClient | undefined;

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter });
}

function ensurePrisma() {
  if (!prismaClient) {
    prismaClient = globalForPrisma.prisma ?? createPrismaClient();
    globalForPrisma.prisma = prismaClient;
  }
  return prismaClient;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_, prop) {
    const client = ensurePrisma();
    const value = (client as unknown as Record<string | symbol, unknown>)[prop];
    return typeof value === "function" ? value.bind(client) : value;
  },
});