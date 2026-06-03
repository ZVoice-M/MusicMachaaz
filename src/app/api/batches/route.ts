import { NextResponse } from "next/server";
import { demoWriteResponse, errorResponse, getApiClient } from "@/lib/api";
import { batchSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const payload = batchSchema.parse(await request.json());
    const supabase = await getApiClient();
    if (!supabase) return demoWriteResponse();
    const { data, error } = await supabase.from("batches").insert(payload).select().single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return errorResponse(error);
  }
}
