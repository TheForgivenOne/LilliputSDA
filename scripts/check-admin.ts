import { PrismaClient } from "@prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"

const prisma = new PrismaClient({
  adapter: new PrismaNeon({
    connectionString: process.env.DATABASE_URL || ""
  }),
})

async function main() {
  const user = await prisma.user.findUnique({ where: { email: "admin@lilliputsda.org" }})
  console.log(JSON.stringify(user, null, 2))
  await prisma.$disconnect()
}

main()