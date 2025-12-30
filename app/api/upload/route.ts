import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const form = await req.formData();

  const chunk = form.get("chunk");
  const userId = form.get("userId");
  const sessionId = form.get("sessionId");
  const index = form.get("index");

  if (
    !(chunk instanceof File) ||
    typeof userId !== "string" ||
    typeof sessionId !== "string" ||
    typeof index !== "string"
  ) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const filePath = `${userId}/${sessionId}/${index.padStart(6, "0")}.webm`;

  const { error } = await supabase.storage
    .from("recordings")
    .upload(filePath, await chunk.arrayBuffer(), {
      contentType: "video/webm",
      upsert: false,
    });

  if (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
