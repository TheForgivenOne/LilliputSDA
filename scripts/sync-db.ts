/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"

const devPrisma = new PrismaClient({
  adapter: new PrismaNeon({
    connectionString: process.env.DEV_DATABASE_URL!
  }),
})

const prodPrisma = new PrismaClient({
  adapter: new PrismaNeon({
    connectionString: process.env.PROD_DATABASE_URL!
  }),
})

const tables = [
  { name: "Account", singular: "account" },
  { name: "Session", singular: "session" },
  { name: "VerificationToken", singular: "verificationToken" },
  { name: "User", singular: "user" },
  { name: "Announcement", singular: "announcement" },
  { name: "Event", singular: "event" },
  { name: "Ministry", singular: "ministry" },
  { name: "Staff", singular: "staff" },
  { name: "ContactSubmission", singular: "contactSubmission" },
  { name: "PrayerRequest", singular: "prayerRequest" },
]

async function syncTable(table: { name: string; singular: string }) {
  console.log(`Syncing ${table.name}...`)
  
  const data = await (devPrisma as any)[table.singular].findMany({})
  console.log(`  Found ${data.length} records in dev`)
  
  if (data.length > 0) {
    await (prodPrisma as any)[table.singular].deleteMany({})
    console.log(`  Cleared production ${table.name}`)
    
    for (const row of data) {
      await (prodPrisma as any)[table.singular].create({ data: row })
    }
    console.log(`  Inserted ${data.length} records to production`)
  }
}

async function main() {
  console.log("Starting database sync from dev to production...\n")
  
  for (const table of tables) {
    try {
      await syncTable(table)
    } catch (error) {
      console.error(`  Error syncing ${table.name}:`, error)
    }
  }
  
  console.log("\nSync complete!")
  await devPrisma.$disconnect()
  await prodPrisma.$disconnect()
}

main()
