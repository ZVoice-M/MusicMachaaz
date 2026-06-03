import { z } from "zod";

export const studentSchema = z.object({
  student_name: z.string().min(2, "Student name is required"),
  mobile: z.string().regex(/^[0-9+\-\s()]{7,18}$/, "Enter a valid mobile number"),
  batch_id: z.string().uuid("Select a batch"),
  joining_date: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  active: z.boolean().default(true),
});

export const batchSchema = z.object({
  batch_name: z.string().min(2, "Batch name is required"),
});

export const paymentSchema = z.object({
  student_id: z.string().uuid(),
  amount: z.coerce.number().positive("Amount must be greater than zero"),
  payment_date: z.string().min(1, "Payment date is required"),
  remarks: z.string().optional().nullable(),
});

export const attendanceSchema = z.object({
  student_id: z.string().uuid(),
  attendance_date: z.string().min(1),
  status: z.enum(["Present", "Absent", "Leave", "Holiday"]),
});

export const settingsSchema = z.object({
  institute_name: z.string().min(2, "Institute name is required"),
  fee_per_day: z.coerce.number().nonnegative(),
  currency: z.string().min(3).max(3),
});

export type StudentInput = z.infer<typeof studentSchema>;
export type BatchInput = z.infer<typeof batchSchema>;
export type PaymentInput = z.infer<typeof paymentSchema>;
export type AttendanceInput = z.infer<typeof attendanceSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
