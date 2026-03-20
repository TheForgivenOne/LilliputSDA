import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

export async function POST(req: Request) {
  if (!WEBHOOK_SECRET) {
    console.error("CLERK_WEBHOOK_SECRET not configured");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 }
    );
  }

  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json(
      { error: "Missing svix headers" },
      { status: 400 }
    );
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return NextResponse.json(
      { error: "Webhook verification failed" },
      { status: 400 }
    );
  }

  const eventType = evt.type;
  const data = evt.data;

  switch (eventType) {
    case "user.created":
    case "user.updated":
      console.log(`User ${eventType.split(".")[1]}:`, {
        id: data.id,
        email: (data as { email_addresses?: { email_address: string }[] }).email_addresses?.[0]?.email_address,
        firstName: (data as { first_name?: string }).first_name,
        lastName: (data as { last_name?: string }).last_name,
      });
      break;

    case "user.deleted":
      console.log("User deleted:", data.id);
      break;

    case "organization.created":
    case "organization.updated":
      console.log(`Organization ${eventType.split(".")[1]}:`, {
        id: data.id,
        name: (data as { name?: string }).name,
        slug: (data as { slug?: string }).slug,
      });
      break;

    case "organization.deleted":
      console.log("Organization deleted:", data.id);
      break;

    case "organizationMembership.created":
    case "organizationMembership.updated":
      console.log(`OrganizationMembership ${eventType.split(".")[1]}:`, {
        id: data.id,
        role: (data as { role?: string }).role,
        organization: (data as { organization?: { id: string; name: string; slug: string } }).organization,
        publicUserData: (data as { public_user_data?: { identifier: string } }).public_user_data,
      });
      break;

    case "organizationMembership.deleted":
      console.log("OrganizationMembership deleted:", {
        id: data.id,
        organization: (data as { organization?: { id: string } }).organization,
      });
      break;

    default:
      console.log(`Unhandled webhook event: ${eventType}`);
  }

  return NextResponse.json({ received: true });
}
