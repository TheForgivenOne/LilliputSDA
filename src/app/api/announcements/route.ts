import { NextResponse } from "next/server";
import type { Announcement } from "@/types";

const announcements: Announcement[] = [
  {
    _id: "1",
    title: "Welcome to Lilliput SDA Church",
    content: "We are glad to have you with us. Join us every Sabbath for worship and fellowship.",
    date: new Date().toISOString(),
    priority: "high",
    category: "General"
  },
  {
    _id: "2",
    title: "Prayer Meeting",
    content: "Join us every Wednesday at 6:00 PM for prayer meeting.",
    date: new Date().toISOString(),
    priority: "normal",
    category: "Events"
  }
];

export async function GET() {
  return NextResponse.json({ announcements });
}
