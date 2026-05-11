import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/db";
import { adminGuard } from "@/lib/auth";

export async function GET() {
  try {
    const media = await prisma.media.findMany({
      orderBy: { uploadedAt: "desc" },
    });
    return NextResponse.json(media);
  } catch (error) {
    console.error("Failed to fetch media:", error);
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const guard = await adminGuard();
  if (guard) return guard;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const name = (formData.get("name") as string) || file?.name || "Untitled";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const blob = await put(file.name, file, {
      access: "public",
    });

    const media = await prisma.media.create({
      data: {
        name,
        url: blob.url,
        blobPathname: blob.pathname,
        type: file.type || "image",
        size: file.size,
      },
    });

    return NextResponse.json(media, { status: 201 });
  } catch (error) {
    console.error("Failed to upload media:", error);
    return NextResponse.json({ error: "Failed to upload media" }, { status: 500 });
  }
}