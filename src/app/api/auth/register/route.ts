import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/db";
import { authLimiter, checkRateLimit } from "@/lib/rate-limit";
import { validateEmail } from "@/lib/validation";

function getClientIP(request: NextRequest): string {
  // Use built-in Next.js IP detection if available
  if (request.ip) return request.ip;

  const headers = request.headers.get("x-forwarded-for");
  if (headers) {
    return headers.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  return "anonymous";
}

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  const { success } = await checkRateLimit(authLimiter, `register:${ip}`);

  if (!success) {
    return NextResponse.json(
      { error: "Too many registration attempts. Please try again later." },
      { status: 429 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { name, email, password } = body;

  // Security: Input validation and length limits
  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  if (name && (typeof name !== "string" || name.length > 200)) {
    return NextResponse.json({ error: "Invalid name" }, { status: 400 });
  }

  if (typeof email !== "string" || !validateEmail(email) || email.length > 320) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  if (typeof password !== "string" || password.length < 6 || password.length > 100) {
    return NextResponse.json(
      { error: "Password must be between 6 and 100 characters" },
      { status: 400 }
    );
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "user",
      },
    });

    return NextResponse.json(
      { id: user.id, email: user.email, name: user.name },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}
