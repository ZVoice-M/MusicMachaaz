"use client";

import { useState } from "react";
import { UserPlus, Pencil, Trash2 } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { DemoBanner } from "@/components/ui/DemoBanner";
import { isDemoMode } from "@/lib/supabase";
import type { Student } from "@/types";
import { formatCurrency } from "@/lib/utils";

const DEMO_STUDENTS: Student[] = [
  { id: "1", name: "Arjun Menon", phone: "9876543210", batch_id: "b1", fee_per_day_override: null, created_at: "2024-01-10" },
  { id: "2", name: "Sneha Krishnan", phone: "9123456789", batch_id: "b1", fee_per_day_override: null, created_at: "2024-01-12" },
  { id: "3", name: "Rahul Das", phone: "9988776655", batch_id: "b2", fee_per_day_override: 200, created_at: "2024-02-01" },
  { id: "4", name: "Priya Nair", phone: null, batch_id: "b2", fee_per_day_override: null, created_at: "2024-02-14" },
  { id: "5", name: "Anil Kumar", phone: "9000011112", batch_id: "b3", fee_per_day_override: null, created_at: "2024-03-05" },
];

export default function StudentsPage() {
  const [students] = useState<Student[]>(DEMO_STUDENTS);

  return (
    <div>
      <PageHeader
        title="Students"
        subtitle={`${students.length} enrolled`}
        actions={
          <Button icon={UserPlus} size="sm">
            Add Student
          </Button>
        }
      />

      {isDemoMode && <DemoBanner />}

      <DataTable
        data={students}
        keyExtractor={(s) => s.id}
        emptyMessage="No students yet. Add your first student."
        columns={[
          {
            key: "name",
            header: "Name",
            cell: (s) => <span className="font-medium text-white">{s.name}</span>,
          },
          {
            key: "phone",
            header: "Phone",
            cell: (s) =>
              s.phone ? (
                <a href={`tel:${s.phone}`} className="text-[#cc6600] hover:underline">
                  {s.phone}
                </a>
              ) : (
                <span className="text-[#555]">—</span>
              ),
          },
          {
            key: "batch",
            header: "Batch",
            cell: (s) => (
              <span className="text-xs bg-[#1a1a1a] border border-[#2a2a2a] px-2 py-1 rounded-md text-[#aaa]">
                {s.batch_id ?? "Unassigned"}
              </span>
            ),
          },
          {
            key: "fee_override",
            header: "Fee / Day",
            cell: (s) =>
              s.fee_per_day_override != null ? (
                <span className="text-[#cc6600]">{formatCurrency(s.fee_per_day_override)}</span>
              ) : (
                <span className="text-[#555] text-xs">Default</span>
              ),
          },
          {
            key: "actions",
            header: "",
            cell: () => (
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" icon={Pencil} aria-label="Edit" />
                <Button variant="ghost" size="sm" icon={Trash2} aria-label="Delete" className="text-red-400 hover:text-red-300" />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
