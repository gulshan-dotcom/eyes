import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { randomUUID } from "crypto";

export async function GET() {
  await connectDB();

  const cookieStore = await cookies();
  const uid = cookieStore.get("uid")?.value;

  // If user is returning (cookie exists)
  if (uid) {
    const existingUser = await User.findOne({ userId: uid });

    if (existingUser) {
      return NextResponse.json({
        status: "returning",
        user: existingUser,
      });
    }
  }

  // New user — generate new ID
  const newId = randomUUID();

  const newUser = await User.create({
    userId: newId,
    videos: [],
  });

  // Set cookie for future visits
  const res = NextResponse.json({
    status: "new",
    user: newUser,
  });

  res.cookies.set("uid", newId, {
    path: "/",
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });

  return res;
}
