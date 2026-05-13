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

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter });
}

function getPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_, prop) {
    return Reflect.get(getPrisma(), prop);
  },
});

if (process.env.NODE_ENV !== "production") {
  process.on("exit", () => globalForPrisma.prisma?.$disconnect());
}