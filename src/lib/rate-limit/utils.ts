import { NextRequest } from "next/server";

export function getClientIP(request: NextRequest): string {
  // Use a type cast to any to access .ip which exists on NextRequest in some environments
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ip = (request as any).ip;
  if (ip) return ip;

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;

  return "127.0.0.1";
}
