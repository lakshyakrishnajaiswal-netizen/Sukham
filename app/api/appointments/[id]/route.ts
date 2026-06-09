import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function requireAdmin(request: Request) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return { error: "Missing auth token" };
  }

  const authClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await authClient.auth.getUser(token);

  if (error || data.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return { error: "Unauthorized" };
  }

  return { user: data.user };
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin(request);

  if ("error" in admin) {
    return NextResponse.json({ ok: false, error: admin.error }, { status: 401 });
  }

  const { status } = await request.json();

  const { error } = await supabase
    .from("appointments")
    .update({ status })
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}