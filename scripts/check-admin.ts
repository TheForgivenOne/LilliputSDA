import { PrismaClient } from "@prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"

const prisma = new PrismaClient({
  adapter: new PrismaNeon({
    connectionString: "postgresql://neondb_owner:npg_gKhZVQY5oB3u@ep-morning-haze-amtgrz1f-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
  }),
})

async function main() {
  const user = await prisma.user.findUnique({ where: { email: "admin@lilliputsda.org" }})
  console.log(JSON.stringify(user, null, 2))
  await prisma.$disconnect()
}

main()