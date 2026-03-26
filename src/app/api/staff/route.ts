import { NextResponse } from "next/server";
import type { StaffMember } from "@/types";

const staff: StaffMember[] = [
  {
    _id: "1",
    name: "Pastor Lataniel Hamilton",
    title: "Junior Pastor",
    role: "Junior Pastor",
    department: "Pastoral",
    email: "lhamilton@westjamaica.org",
    phone: "(876) 123-4567",
    isActive: true,
    order: 1,
  },
  {
    _id: "2",
    name: "Elder John Smith",
    title: "Church Elder",
    role: "Head Elder",
    department: "Leadership",
    email: "jsmith@email.com",
    phone: "(876) 234-5678",
    isActive: true,
    order: 2,
  },
];

export async function GET() {
  return NextResponse.json({ staff });
}
