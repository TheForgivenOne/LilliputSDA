import { NextResponse } from "next/server";
import type { ChurchEvent } from "@/types";

const events: ChurchEvent[] = [
  {
    _id: "1",
    title: "Sabbath School",
    startDate: "2026-03-28T09:00:00",
    location: "Main Sanctuary",
    category: "service",
    description: "Bible study for all ages"
  },
  {
    _id: "2",
    title: "Divine Service",
    startDate: "2026-03-28T11:00:00",
    location: "Main Sanctuary",
    category: "service",
    description: "Worship service with preaching"
  },
  {
    _id: "3",
    title: "Youth Meeting",
    startDate: "2026-03-28T15:00:00",
    location: "Youth Hall",
    category: "youth",
    description: "Youth fellowship and Bible study"
  }
];

export async function GET() {
  return NextResponse.json({ events });
}
