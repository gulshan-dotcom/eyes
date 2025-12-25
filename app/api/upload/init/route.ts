// app/api/upload/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const cookieStore = await cookies();
  const uid = cookieStore.get("uid")?.value;

  if (!uid) {
    return NextResponse.json({ error: "User not identified" }, { status: 400 });
  }

  // prepare folder
  const baseDir = path.join(process.cwd(), "recordings");
  if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir);

  const userDir = path.join(baseDir, uid);
  if (!fs.existsSync(userDir)) fs.mkdirSync(userDir);

  const sessionId = Date.now().toString();

  const outFile = path.join(userDir, `${sessionId}.webm`);

  const res = NextResponse.json({ ok: true, status: 200, outFile });

  return res;
}
