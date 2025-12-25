import { NextResponse } from "next/server";
import fs from "fs";

export async function POST(req: Request) {
  const formData = await req.formData();
  const chunk = formData.get("chunk");
  const fileLoc = formData.get("fileLoc");
  console.log("fileLoc FROM CLIENT:", fileLoc);

  if (!(chunk instanceof File)) {
    return NextResponse.json(
      { error: "Invalid or missing file chunk" },
      { status: 400 }
    );
  }

  if (typeof fileLoc !== "string") {
    return NextResponse.json({ error: "Invalid fileLoc" }, { status: 400 });
  }

  const arrayBuffer = await chunk.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  fs.appendFileSync(fileLoc, buffer);

  return NextResponse.json({ ok: true });
}
