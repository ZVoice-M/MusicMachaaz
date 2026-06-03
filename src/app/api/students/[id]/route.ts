import { NextResponse } from "next/server";
import { demoWriteResponse, errorResponse, getApiClient } from "@/lib/api";
import { studentSchema } from "@/lib/validations";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const raw = studentSchema.partial().parse(await request.json());
    const payload = {
      ...raw,
      joining_date: raw.joining_date || null,
      notes: raw.notes || null,
    };
    const supabase = await getApiClient();
    if (!supabase) return demoWriteResponse();
    const { data, error } = await supabase.from("students").update(payload).eq("id", id).select().single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await getApiClient();
    if (!supabase) return demoWriteResponse();
    const { error } = await supabase.from("students").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
