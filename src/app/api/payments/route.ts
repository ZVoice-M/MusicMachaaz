import { NextResponse } from "next/server";
import { demoWriteResponse, errorResponse, getApiClient } from "@/lib/api";
import { paymentSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const raw = paymentSchema.parse(await request.json());
    const payload = { ...raw, remarks: raw.remarks || null };
    const supabase = await getApiClient();
    if (!supabase) return demoWriteResponse();
    const { data, error } = await supabase.from("payments").insert(payload).select().single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return errorResponse(error);
  }
}
