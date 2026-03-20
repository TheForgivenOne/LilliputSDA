import { NextResponse } from "next/server";
import { Resend } from "resend";
import { emailLimiter } from "@/lib/rate-limit";

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

interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

interface PrayerPayload {
  name: string;
  email: string;
  request: string;
  isPublic: boolean;
}

function validateContactPayload(data: unknown): data is ContactPayload {
  if (typeof data !== "object" || data === null) return false;
  const obj = data as Record<string, unknown>;
  return (
    typeof obj.name === "string" &&
    obj.name.length > 0 &&
    obj.name.length <= 200 &&
    typeof obj.email === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(obj.email) &&
    typeof obj.message === "string" &&
    obj.message.length > 0 &&
    obj.message.length <= 5000
  );
}

function validatePrayerPayload(data: unknown): data is PrayerPayload {
  if (typeof data !== "object" || data === null) return false;
  const obj = data as Record<string, unknown>;
  return (
    typeof obj.name === "string" &&
    obj.name.length > 0 &&
    obj.name.length <= 200 &&
    typeof obj.email === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(obj.email) &&
    typeof obj.request === "string" &&
    obj.request.length > 0 &&
    obj.request.length <= 2000 &&
    typeof obj.isPublic === "boolean"
  );
}

function contactNotificationHtml(data: ContactPayload): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
      </div>
      <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="margin-top: 0;">You have received a new message from the Lilliput SDA church website.</p>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0 0 15px 0;"><strong>Name:</strong> ${escapeHtml(data.name)}</p>
          <p style="margin: 0 0 15px 0;"><strong>Email:</strong> <a href="mailto:${escapeHtml(data.email)}" style="color: #d97706;">${escapeHtml(data.email)}</a></p>
          <p style="margin: 0;"><strong>Message:</strong></p>
          <p style="margin: 10px 0 0 0; white-space: pre-wrap;">${escapeHtml(data.message)}</p>
        </div>
        
        <p style="color: #666; font-size: 14px;">Reply directly to this email to respond to the sender.</p>
      </div>
      <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
        <p style="margin: 0;">Lilliput SDA Church</p>
        <p style="margin: 5px 0 0 0;">Montego Bay, Jamaica</p>
      </div>
    </body>
    </html>
  `;
}

function prayerNotificationHtml(data: PrayerPayload): string {
  const visibilityText = data.isPublic ? "Yes - will be shared on the prayer list" : "No - private request";
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Prayer Request Submitted</h1>
      </div>
      <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="margin-top: 0;">A prayer request has been submitted through the Lilliput SDA church website.</p>
        
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <p style="margin: 0 0 15px 0;"><strong>Name:</strong> ${escapeHtml(data.name)}</p>
          <p style="margin: 0 0 15px 0;"><strong>Email:</strong> <a href="mailto:${escapeHtml(data.email)}" style="color: #d97706;">${escapeHtml(data.email)}</a></p>
          <p style="margin: 0 0 15px 0;"><strong>Share on Prayer List:</strong> ${visibilityText}</p>
          <p style="margin: 0;"><strong>Prayer Request:</strong></p>
          <p style="margin: 10px 0 0 0; white-space: pre-wrap;">${escapeHtml(data.request)}</p>
        </div>
        
        <p style="margin-top: 20px;"><strong>Action Needed:</strong> Please lift this request up in prayer.</p>
      </div>
      <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
        <p style="margin: 0;">Lilliput SDA Church - Prayer Ministry</p>
        <p style="margin: 5px 0 0 0;">Montego Bay, Jamaica</p>
      </div>
    </body>
    </html>
  `;
}

function thankYouHtml(type: "contact" | "prayer"): string {
  const title = type === "contact" ? "Message Received!" : "Prayer Request Received!";
  const message = type === "contact" 
    ? "Thank you for reaching out. We have received your message and will respond as soon as possible."
    : "Thank you for trusting us with your prayer request. Our prayer team will lift you up before the Lord.";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">${title}</h1>
      </div>
      <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="margin-top: 0;">Dear Friend,</p>
        <p>${message}</p>
        <p>May God's grace and peace be with you.</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5;">
          <p style="margin: 0; font-weight: 600;">In His Service,</p>
          <p style="margin: 5px 0 0 0;">Lilliput SDA Church</p>
          <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Montego Bay, Jamaica</p>
        </div>
      </div>
      <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
        <p style="margin: 0;">This is an automated message. Please do not reply to this email.</p>
      </div>
    </body>
    </html>
  `;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

export async function POST(request: Request) {
  const ip = getClientIP(request);
  const { success } = await emailLimiter.limit(ip);
  
  if (!success) {
    return NextResponse.json(
      { error: "Too many requests, please try again later" },
      { status: 429 }
    );
  }
  
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    if (!process.env.ADMIN_EMAIL || !process.env.PRAYER_TEAM_EMAIL) {
      console.error("Email configuration missing");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const { type, data } = await request.json();

    if (!type || !data) {
      return NextResponse.json({ error: "Missing type or data" }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    if (type === "contact") {
      if (!validateContactPayload(data)) {
        return NextResponse.json({ error: "Invalid contact form data" }, { status: 400 });
      }

      const payload = data as ContactPayload;
      
      const [adminResult, thankYouResult] = await Promise.all([
        resend.emails.send({
          from: "Lilliput SDA <onboarding@resend.dev>",
          to: process.env.ADMIN_EMAIL,
          subject: `New Contact Form Submission from ${payload.name}`,
          html: contactNotificationHtml(payload),
          replyTo: payload.email,
        }),
        resend.emails.send({
          from: "Lilliput SDA <onboarding@resend.dev>",
          to: payload.email,
          subject: "We Received Your Message",
          html: thankYouHtml("contact"),
        }),
      ]);

      if (adminResult.error || thankYouResult.error) {
        console.error("Email errors:", { admin: adminResult.error, thankYou: thankYouResult.error });
        return NextResponse.json({ error: "Failed to send emails" }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    if (type === "prayer") {
      if (!validatePrayerPayload(data)) {
        return NextResponse.json({ error: "Invalid prayer request data" }, { status: 400 });
      }

      const payload = data as PrayerPayload;
      
      const [prayerResult, thankYouResult] = await Promise.all([
        resend.emails.send({
          from: "Lilliput SDA <onboarding@resend.dev>",
          to: process.env.PRAYER_TEAM_EMAIL,
          subject: `Prayer Request from ${payload.name}`,
          html: prayerNotificationHtml(payload),
          replyTo: payload.email,
        }),
        resend.emails.send({
          from: "Lilliput SDA <onboarding@resend.dev>",
          to: payload.email,
          subject: "Prayer Request Received",
          html: thankYouHtml("prayer"),
        }),
      ]);

      if (prayerResult.error || thankYouResult.error) {
        console.error("Prayer email errors:", prayerResult.error, thankYouResult.error);
        return NextResponse.json({ error: "Failed to send emails" }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("Email API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
