import { NextRequest } from "next/server";

export function getClientIP(request: NextRequest): string {
  const ip = (request as { ip?: string }).ip;
  if (ip) return ip;

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;

  return "anonymous";
}
