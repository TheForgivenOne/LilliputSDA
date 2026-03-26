import { hash } from "bcryptjs";
import { prisma } from "../src/lib/db";

async function createAdmin() {
  const hashedPassword = await hash("admin123", 12);
  
  const user = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@lilliputsda.org",
      password: hashedPassword,
      role: "admin",
    },
  });

  console.log("Admin created:", user.email);
}

createAdmin()
  .catch(console.error)
  .finally(() => prisma.$disconnect());