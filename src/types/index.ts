// ─── Domain types ───────────────────────────────────────────────────────────

export type AttendanceStatus = "present" | "absent" | "leave" | "holiday";

export interface Student {
  id: string;
  name: string;
  phone: string | null;
  batch_id: string | null;
  fee_per_day_override: number | null;
  created_at: string;
}

export interface Batch {
  id: string;
  name: string;
  schedule: string | null;
  created_at: string;
}

export interface AttendanceRecord {
  id: string;
  student_id: string;
  date: string; // ISO date string YYYY-MM-DD
  status: AttendanceStatus;
}

export interface Payment {
  id: string;
  student_id: string;
  amount: number;
  paid_on: string;
  note: string | null;
}

export interface Settings {
  fee_per_day: number;
}

// ─── View / computed types ────────────────────────────────────────────────────

export interface StudentDueSummary {
  student: Student;
  batch: Batch | null;
  present_days: number;
  generated_fees: number;
  total_paid: number;
  pending: number;
}

export interface MonthAttendanceRow {
  student: Student;
  days: Record<number, AttendanceStatus>; // day-of-month → status
}
