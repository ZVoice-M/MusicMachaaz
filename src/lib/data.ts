import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";
import { demoAttendance, demoBatches, demoLedger, demoPayments, demoSettings, demoStudents } from "@/lib/demo-data";
import { hasSupabaseEnv } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { Attendance, Batch, Payment, Settings, Student, StudentLedger } from "@/types/database";

async function client() {
  if (!hasSupabaseEnv()) return null;
  return createSupabaseServerClient();
}

export async function getSettings(): Promise<Settings> {
  const supabase = await client();
  if (!supabase) return demoSettings;
  const { data } = await supabase.from("settings").select("*").limit(1).maybeSingle();
  return data ?? demoSettings;
}

export async function getBatches(): Promise<Batch[]> {
  const supabase = await client();
  if (!supabase) return demoBatches;
  const { data } = await supabase.from("batches").select("*").order("batch_name");
  return data ?? [];
}

export async function getStudents(): Promise<Student[]> {
  const supabase = await client();
  if (!supabase) return demoStudents;
  const { data } = await supabase.from("students").select("*, batches(*)").order("student_name");
  return (data as Student[]) ?? [];
}

export async function getStudentLedger(): Promise<StudentLedger[]> {
  const supabase = await client();
  if (!supabase) return demoLedger();
  const { data } = await supabase.from("student_financials").select("*, batches(*)").order("student_name");
  return (data as StudentLedger[]) ?? [];
}

export async function getAttendance(month?: Date, batchId?: string): Promise<Attendance[]> {
  const supabase = await client();
  if (!supabase) return demoAttendance;

  let query = supabase.from("attendance").select("*");

  if (batchId) {
    const students = await getStudents();
    const ids = students.filter((student) => student.batch_id === batchId).map((student) => student.id);
    query = query.in("student_id", ids);
  }

  const { data } = await query;
  return data ?? [];
}

export async function getPayments(studentId?: string): Promise<Payment[]> {
  const supabase = await client();
  if (!supabase) return studentId ? demoPayments.filter((payment) => payment.student_id === studentId) : demoPayments;
  let query = supabase.from("payments").select("*").order("payment_date", { ascending: false });
  if (studentId) query = query.eq("student_id", studentId);
  const { data } = await query;
  return data ?? [];
}

export async function getDashboardData() {
  const [settings, batches, students, ledger, attendance, payments] = await Promise.all([
    getSettings(),
    getBatches(),
    getStudents(),
    getStudentLedger(),
    getAttendance(new Date()),
    getPayments(),
  ]);
  const today = format(new Date(), "yyyy-MM-dd");
  const todayAttendance = attendance.filter((item) => item.attendance_date === today);
  const monthNames = Array.from({ length: 6 }, (_, index) => subMonths(new Date(), 5 - index));
  const attendanceTrend = monthNames.map((date) => ({
    month: format(date, "MMM"),
    present: Math.max(0, Math.round(ledger.reduce((sum, item) => sum + item.present_days, 0) / (6 - date.getMonth() % 3))),
    absent: Math.max(0, Math.round(ledger.reduce((sum, item) => sum + item.absent_days, 0) / 2)),
  }));
  const feeTrend = monthNames.map((date, index) => ({
    month: format(date, "MMM"),
    collected: payments.reduce((sum, payment) => sum + payment.amount, 0) * (0.5 + index / 10),
    pending: ledger.reduce((sum, item) => sum + Math.max(item.pending_amount, 0), 0) * (1 - index / 12),
  }));

  return {
    settings,
    batches,
    students,
    ledger,
    attendance,
    payments,
    today: {
      Present: todayAttendance.filter((item) => item.status === "Present").length,
      Absent: todayAttendance.filter((item) => item.status === "Absent").length,
      Leave: todayAttendance.filter((item) => item.status === "Leave").length,
      Holiday: todayAttendance.filter((item) => item.status === "Holiday").length,
    },
    attendanceTrend,
    feeTrend,
  };
}

export async function getMonthlyLedger(month: number, year: number): Promise<StudentLedger[]> {
  const supabase = await client();
  const from = `${year}-${String(month).padStart(2, "0")}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const to = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

  if (!supabase) {
    return demoLedger().map((row) => {
      const att = demoAttendance.filter((a) => a.student_id === row.id && a.attendance_date >= from && a.attendance_date <= to);
      const pays = demoPayments.filter((p) => p.student_id === row.id && p.payment_date >= from && p.payment_date <= to);
      const present = att.filter((a) => a.status === "Present").length;
      const paid = pays.reduce((s, p) => s + p.amount, 0);
      const generated = present * demoSettings.fee_per_day;
      return { ...row, present_days: present, generated_fees: generated, paid_amount: paid, pending_amount: generated - paid };
    });
  }

  const [{ data: attData }, { data: payData }, { data: students }] = await Promise.all([
    supabase.from("attendance").select("student_id, status").gte("attendance_date", from).lte("attendance_date", to),
    supabase.from("payments").select("student_id, amount, payment_date").gte("payment_date", from).lte("payment_date", to).order("payment_date", { ascending: false }),
    supabase.from("students").select("*, batches(*)").order("student_name"),
  ]);

  const settings = await getSettings();

  return ((students as Student[]) ?? []).map((student) => {
    const att = (attData ?? []).filter((a) => a.student_id === student.id);
    const pays = (payData ?? []).filter((p) => p.student_id === student.id);
    const present = att.filter((a) => a.status === "Present").length;
    const paid = pays.reduce((s, p) => s + p.amount, 0);
    const generated = present * settings.fee_per_day;
    return {
      ...student,
      present_days: present,
      absent_days: att.filter((a) => a.status === "Absent").length,
      leave_days: att.filter((a) => a.status === "Leave").length,
      holiday_days: att.filter((a) => a.status === "Holiday").length,
      generated_fees: generated,
      paid_amount: paid,
      pending_amount: generated - paid,
      last_payment_date: pays[0]?.payment_date ?? null,
    } as StudentLedger;
  });
}
