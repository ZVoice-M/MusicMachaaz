import { NextResponse } from "next/server";
import { hasSupabaseEnv } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function getApiClient() {
  if (!hasSupabaseEnv()) return null;
  return createSupabaseServerClient();
}

export function demoWriteResponse() {
  return NextResponse.json({ ok: true, demo: true });
}

export function errorResponse(error: unknown, status = 400) {
  const message = error instanceof Error ? error.message : "Request failed";
  return NextResponse.json({ error: message }, { status });
}
