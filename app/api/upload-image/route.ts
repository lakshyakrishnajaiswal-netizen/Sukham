import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const allowedBuckets = new Set([
  "hero",
  "experts",
  "certificates",
  "workshops",
  "blogs",
  "gallery",
  "reviews"
]);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function getExtension(fileName: string, fileType: string) {
  const fromName = fileName.split(".").pop()?.toLowerCase();

  if (fromName && /^[a-z0-9]+$/.test(fromName)) {
    return fromName;
  }

  return fileType.split("/").pop()?.toLowerCase() || "jpg";
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const bucket = String(formData.get("bucket") || "gallery");

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "Missing image file" }, { status: 400 });
  }

  if (!allowedBuckets.has(bucket)) {
    return NextResponse.json({ ok: false, error: "Invalid image bucket" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ ok: false, error: "Only image files are allowed" }, { status: 400 });
  }

  const extension = getExtension(file.name, file.type);
  const path = `${Date.now()}-${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: file.type,
    upsert: false
  });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);

  return NextResponse.json({ ok: true, url: data.publicUrl });
}
