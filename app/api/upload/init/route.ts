import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const uid = (await cookies()).get("uid")?.value || "demo-user";

  const sessionId = Date.now().toString();

  return NextResponse.json({
    ok: true,
    userId: uid,
    sessionId,
  });
}
