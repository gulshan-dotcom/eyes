import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { lan, lon } = await req.json();

    if (!lan || !lon) {
      return NextResponse.json(
        { error: "Coordinates missing" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const userId = cookieStore.get("uid")?.value;

    if (!userId) {
      return NextResponse.json(
        { error: "No user cookie found" },
        { status: 401 }
      );
    }

    const user = await User.findOne({ userId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user location in DB
    user.location.lan = [...user.location.lan, lan];
    user.location.lon = [...user.location.lon, lon];
    await user.save();

    return NextResponse.json({
      status: "success",
      message: "Location updated",
      user,
    });
  } catch (error) {
    console.error("Location update error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
