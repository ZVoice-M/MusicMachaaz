import { subDays } from "date-fns";
import { toDateInput } from "@/lib/utils";
import type { Attendance, Batch, Payment, Settings, Student, StudentLedger } from "@/types/database";

export const demoSettings: Settings = {
  id: "11111111-1111-1111-1111-111111111111",
  institute_name: "Music Machaanz",
  fee_per_day: 100,
  currency: "INR",
};

export const demoBatches: Batch[] = [
  { id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", batch_name: "Guitar Batch A", created_at: toDateInput(subDays(new Date(), 90)) },
  { id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb", batch_name: "Keyboard Batch A", created_at: toDateInput(subDays(new Date(), 75)) },
  { id: "cccccccc-cccc-cccc-cccc-cccccccccccc", batch_name: "Vocal Batch A", created_at: toDateInput(subDays(new Date(), 40)) },
];

export const demoStudents: Student[] = [
  { id: "10000000-0000-0000-0000-000000000001", student_name: "Aarav Sharma", mobile: "+91 98765 43210", batch_id: demoBatches[0].id, joining_date: toDateInput(subDays(new Date(), 80)), notes: "Prefers evening practice.", active: true, created_at: toDateInput(subDays(new Date(), 80)), batches: demoBatches[0] },
  { id: "10000000-0000-0000-0000-000000000002", student_name: "Diya Mehta", mobile: "+91 99887 76655", batch_id: demoBatches[1].id, joining_date: toDateInput(subDays(new Date(), 62)), notes: null, active: true, created_at: toDateInput(subDays(new Date(), 62)), batches: demoBatches[1] },
  { id: "10000000-0000-0000-0000-000000000003", student_name: "Kabir Nair", mobile: "+91 91234 56789", batch_id: demoBatches[2].id, joining_date: toDateInput(subDays(new Date(), 45)), notes: "Preparing for annual showcase.", active: true, created_at: toDateInput(subDays(new Date(), 45)), batches: demoBatches[2] },
];

export const demoAttendance: Attendance[] = demoStudents.flatMap((student, index) =>
  Array.from({ length: 18 }, (_, day) => ({
    id: `${student.id}-${day}`,
    student_id: student.id,
    attendance_date: toDateInput(subDays(new Date(), day + index)),
    status: day % 9 === 0 ? "Leave" : day % 7 === 0 ? "Absent" : "Present",
    created_at: toDateInput(subDays(new Date(), day)),
  })),
);

export const demoPayments: Payment[] = [
  { id: "20000000-0000-0000-0000-000000000001", student_id: demoStudents[0].id, amount: 900, payment_date: toDateInput(subDays(new Date(), 9)), remarks: "Monthly fee", created_at: toDateInput(subDays(new Date(), 9)) },
  { id: "20000000-0000-0000-0000-000000000002", student_id: demoStudents[1].id, amount: 1200, payment_date: toDateInput(subDays(new Date(), 6)), remarks: "Partial payment", created_at: toDateInput(subDays(new Date(), 6)) },
  { id: "20000000-0000-0000-0000-000000000003", student_id: demoStudents[2].id, amount: 700, payment_date: toDateInput(subDays(new Date(), 2)), remarks: "Advance", created_at: toDateInput(subDays(new Date(), 2)) },
];

export function demoLedger(): StudentLedger[] {
  return demoStudents.map((student) => {
    const attendance = demoAttendance.filter((item) => item.student_id === student.id);
    const payments = demoPayments.filter((item) => item.student_id === student.id);
    const presentDays = attendance.filter((item) => item.status === "Present").length;
    const generated = presentDays * demoSettings.fee_per_day;
    const paid = payments.reduce((sum, payment) => sum + payment.amount, 0);
    return {
      ...student,
      present_days: presentDays,
      absent_days: attendance.filter((item) => item.status === "Absent").length,
      leave_days: attendance.filter((item) => item.status === "Leave").length,
      holiday_days: attendance.filter((item) => item.status === "Holiday").length,
      generated_fees: generated,
      paid_amount: paid,
      pending_amount: generated - paid,
      last_payment_date: payments.at(-1)?.payment_date ?? null,
    };
  });
}
