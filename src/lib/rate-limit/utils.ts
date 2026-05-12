import { NextRequest } from "next/server";

/**
 * Gets the client's IP address from the request.
 * Prefers request.ip, falling back to common headers.
 */
export function getClientIP(request: NextRequest): string {
  // @ts-expect-error - ip exists on NextRequest but might not be in the type definition of the current version
  const ip = request.ip;
  if (ip) {
    return ip;
  }

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  return "anonymous";
}
