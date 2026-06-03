import { NextResponse } from "next/server";
import { demoWriteResponse, errorResponse, getApiClient } from "@/lib/api";
import { settingsSchema } from "@/lib/validations";

export async function PATCH(request: Request) {
  try {
    const payload = settingsSchema.parse(await request.json());
    const supabase = await getApiClient();
    if (!supabase) return demoWriteResponse();
    const existing = await supabase.from("settings").select("id").limit(1).maybeSingle();
    const query = existing.data?.id
      ? supabase.from("settings").update(payload).eq("id", existing.data.id)
      : supabase.from("settings").insert(payload);
    const { data, error } = await query.select().single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return errorResponse(error);
  }
}
