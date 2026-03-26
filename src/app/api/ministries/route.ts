import { NextResponse } from "next/server";
import type { Ministry } from "@/types";

const ministries: Ministry[] = [
  {
    _id: "1",
    name: "Adventist Youth (AY)",
    description: "Our youth ministry provides a dynamic environment for young people to grow spiritually.",
    leader: "Sister Patricia Brown",
    meetingTime: "Saturdays at 4:30 PM",
    meetingLocation: "Fellowship Hall",
    category: "youth",
    order: 1,
  },
  {
    _id: "2",
    name: "Pathfinders",
    description: "A worldwide organization for young people focused on building character.",
    leader: "Brother David Johnson",
    meetingTime: "Sundays at 2:00 PM",
    meetingLocation: "Church Grounds",
    category: "youth",
    order: 2,
  },
];

export async function GET() {
  return NextResponse.json({ ministries });
}
