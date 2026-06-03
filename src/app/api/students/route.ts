import { NextResponse } from "next/server";
import { demoWriteResponse, errorResponse, getApiClient } from "@/lib/api";
import { studentSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const raw = studentSchema.parse(await request.json());
    const payload = {
      ...raw,
      joining_date: raw.joining_date || null,
      notes: raw.notes || null,
    };
    const supabase = await getApiClient();
    if (!supabase) return demoWriteResponse();
    const { data, error } = await supabase.from("students").insert(payload).select().single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return errorResponse(error);
  }
}
