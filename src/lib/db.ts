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
  const adapter = new PrismaNeon({ connectionString: connectionString || "" });
  return new PrismaClient({ adapter });
}

function createLazyPrismaClient() {
  let client: PrismaClient | null = null;
  return new Proxy<PrismaClient>({} as PrismaClient, {
    get(_, prop) {
      if (!client) {
        const connectionString = process.env.DATABASE_URL;
        if (!connectionString) {
          throw new Error("DATABASE_URL environment variable is not set");
        }
        client = createPrismaClient();
      }
      return Reflect.get(client, prop);
    },
  });
}

export const prisma = globalForPrisma.prisma ?? createLazyPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;