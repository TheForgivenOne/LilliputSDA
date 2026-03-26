import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, emailLimiter } from "@/lib/rate-limit";

function getClientIP(request: Request): string {
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

function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
}

function sanitizeInput(input: string): string {
  return input.replace(/[<>]/g, "").substring(0, 2000).trim();
}

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  const { success } = await checkRateLimit(emailLimiter, ip);
  
  if (!success) {
    return NextResponse.json(
      { error: "Too many requests, please try again later" },
      { status: 429 }
    );
  }
  
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body", code: "INVALID_JSON" },
        { status: 400 }
      );
    }
    
    const { type, name, email, message, request: prayerRequest, isPublic } = body;
    
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }
    
    if (!email || typeof email !== "string" || !validateEmail(email)) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }
    
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = email.toLowerCase().trim();
    
    if (type === "contact") {
      if (!message || typeof message !== "string" || !message.trim()) {
        return NextResponse.json(
          { error: "Message is required" },
          { status: 400 }
        );
      }
      
      const sanitizedMessage = sanitizeInput(message);
      
      console.log("Contact form submission:", { name: sanitizedName, email: sanitizedEmail, message: sanitizedMessage });
      
      return NextResponse.json({
        success: true,
        message: "Thank you for your message! We'll be in touch soon."
      });
    } else if (type === "prayer") {
      if (!prayerRequest || typeof prayerRequest !== "string" || !prayerRequest.trim()) {
        return NextResponse.json(
          { error: "Prayer request is required" },
          { status: 400 }
        );
      }
      
      const sanitizedPrayerRequest = sanitizeInput(prayerRequest);
      
      console.log("Prayer request submission:", { name: sanitizedName, email: sanitizedEmail, request: sanitizedPrayerRequest, isPublic });
      
      return NextResponse.json({
        success: true,
        message: "Your prayer request has been submitted. Our prayer team will lift you up in prayer."
      });
    }
    
    return NextResponse.json(
      { error: "Invalid submission type" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Form submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}