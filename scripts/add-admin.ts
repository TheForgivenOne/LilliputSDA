import { PrismaClient } from "@prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"

const prodPrisma = new PrismaClient({
  adapter: new PrismaNeon({
    connectionString: process.env.PROD_DATABASE_URL
  }),
})

async function main() {
  await prodPrisma.user.update({
    where: { email: "admin@lilliputsda.org" },
    data: { password: "$2b$12$1HdUECLzWGFmhb/XWjt1CuZJGRdS3WyBcDmX.xLoiboD7stmwexJm" },
  })
  console.log("Admin user password updated with bcrypt hash")
  await prodPrisma.$disconnect()
}

main()