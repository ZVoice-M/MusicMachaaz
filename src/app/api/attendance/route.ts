import { NextResponse } from "next/server";
import { demoWriteResponse, errorResponse, getApiClient } from "@/lib/api";
import { attendanceSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const payload = attendanceSchema.parse(await request.json());
    const supabase = await getApiClient();
    if (!supabase) return demoWriteResponse();
    const { data, error } = await supabase
      .from("attendance")
      .upsert(payload, { onConflict: "student_id,attendance_date" })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return errorResponse(error);
  }
}
