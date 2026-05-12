import { NextRequest } from "next/server";

/**
 * Gets the client's IP address from the request.
 * Prefers request.ip and falls back to headers.
 */
export function getClientIP(request: NextRequest): string {
  // In some environments like Vercel, request.ip is available
  const ip = (request as any).ip;
  if (ip) return ip;

  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  return "anonymous";
}
