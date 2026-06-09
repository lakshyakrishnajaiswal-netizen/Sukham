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

export async function POST(request: Request) {
  const appointment = await request.json();

  const { error } = await supabase.from("appointments").insert({
    name: appointment.name,
    phone_number: appointment.phone_number,
    email: appointment.email,
    service: appointment.service,
    preferred_date: appointment.preferred_date,
    preferred_time: appointment.preferred_time,
    message: appointment.message || "",
    status: "Pending"
  });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function GET(request: Request) {
  const admin = await requireAdmin(request);

  if ("error" in admin) {
    return NextResponse.json({ ok: false, error: admin.error }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, appointments: data });
}