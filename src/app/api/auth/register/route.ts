import { NextRequest, NextResponse } from "next/server";

export async function POST(_request: NextRequest) {
  // Registration is disabled for security reasons to prevent unauthorized admin creation.
  // Use the setup script for initial admin creation.
  return NextResponse.json(
    { error: "Registration is currently disabled" },
    { status: 403 }
  );
}
