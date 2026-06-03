export type AttendanceStatus = "Present" | "Absent" | "Leave" | "Holiday";

export type Batch = {
  id: string;
  batch_name: string;
  created_at: string;
};

export type Student = {
  id: string;
  student_name: string;
  mobile: string;
  batch_id: string | null;
  joining_date: string | null;
  notes: string | null;
  active: boolean;
  created_at: string;
  batches?: Batch | null;
};

export type Attendance = {
  id: string;
  student_id: string;
  attendance_date: string;
  status: AttendanceStatus;
  created_at: string;
};

export type Payment = {
  id: string;
  student_id: string;
  amount: number;
  payment_date: string;
  remarks: string | null;
  created_at: string;
};

export type Settings = {
  id: string;
  institute_name: string | null;
  fee_per_day: number;
  currency: string;
};

export type StudentLedger = Student & {
  present_days: number;
  absent_days: number;
  leave_days: number;
  holiday_days: number;
  generated_fees: number;
  paid_amount: number;
  pending_amount: number;
  last_payment_date: string | null;
};

export type Database = {
  public: {
    Tables: {
      batches: {
        Row: Batch;
        Insert: Omit<Batch, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Omit<Batch, "id" | "created_at">>;
        Relationships: [];
      };
      students: {
        Row: Student;
        Insert: Omit<Student, "id" | "created_at" | "batches"> & { id?: string; created_at?: string };
        Update: Partial<Omit<Student, "id" | "created_at" | "batches">>;
        Relationships: [
          {
            foreignKeyName: "students_batch_id_fkey";
            columns: ["batch_id"];
            isOneToOne: false;
            referencedRelation: "batches";
            referencedColumns: ["id"];
          },
        ];
      };
      attendance: {
        Row: Attendance;
        Insert: Omit<Attendance, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Omit<Attendance, "id" | "created_at">>;
        Relationships: [
          {
            foreignKeyName: "attendance_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
      payments: {
        Row: Payment;
        Insert: Omit<Payment, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Omit<Payment, "id" | "created_at">>;
        Relationships: [
          {
            foreignKeyName: "payments_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
      settings: {
        Row: Settings;
        Insert: Partial<Settings>;
        Update: Partial<Settings>;
        Relationships: [];
      };
    };
    Views: {
      student_financials: {
        Row: StudentLedger;
        Relationships: [
          {
            foreignKeyName: "students_batch_id_fkey";
            columns: ["batch_id"];
            isOneToOne: false;
            referencedRelation: "batches";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
