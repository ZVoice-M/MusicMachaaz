"use client";

import { useState } from "react";
import { FileDown, FileSpreadsheet } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { DemoBanner } from "@/components/ui/DemoBanner";
import { isDemoMode } from "@/lib/supabase";
import type { StudentDueSummary } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

const DEMO_DUES: StudentDueSummary[] = [
  { student: { id: "1", name: "Arjun Menon", phone: "9876543210", batch_id: "b1", fee_per_day_override: null, created_at: "" }, batch: { id: "b1", name: "Morning Batch", schedule: null, created_at: "" }, present_days: 18, generated_fees: 2700, total_paid: 2000, pending: 700 },
  { student: { id: "2", name: "Sneha Krishnan", phone: null, batch_id: "b1", fee_per_day_override: null, created_at: "" }, batch: { id: "b1", name: "Morning Batch", schedule: null, created_at: "" }, present_days: 20, generated_fees: 3000, total_paid: 3000, pending: 0 },
  { student: { id: "3", name: "Rahul Das", phone: "9988776655", batch_id: "b2", fee_per_day_override: 200, created_at: "" }, batch: { id: "b2", name: "Evening Batch", schedule: null, created_at: "" }, present_days: 15, generated_fees: 3000, total_paid: 1500, pending: 1500 },
  { student: { id: "4", name: "Priya Nair", phone: null, batch_id: "b2", fee_per_day_override: null, created_at: "" }, batch: { id: "b2", name: "Evening Batch", schedule: null, created_at: "" }, present_days: 22, generated_fees: 3300, total_paid: 3300, pending: 0 },
  { student: { id: "5", name: "Anil Kumar", phone: "9000011112", batch_id: "b3", fee_per_day_override: null, created_at: "" }, batch: { id: "b3", name: "Weekend Batch", schedule: null, created_at: "" }, present_days: 8, generated_fees: 1200, total_paid: 0, pending: 1200 },
];

export default function DuesPage() {
  const [dues] = useState<StudentDueSummary[]>(DEMO_DUES);
  const [exporting, setExporting] = useState<"pdf" | "excel" | null>(null);
  const month = "June 2025";

  const totalPending = dues.reduce((s, d) => s + d.pending, 0);
  const overdueCount = dues.filter((d) => d.pending > 0).length;

  async function handleExportPDF() {
    setExporting("pdf");
    try {
      const { exportDuesToPDF } = await import("@/lib/export-pdf");
      exportDuesToPDF(dues, month);
      toast.success("PDF exported successfully");
    } catch {
      toast.error("Failed to export PDF");
    } finally {
      setExporting(null);
    }
  }

  async function handleExportExcel() {
    setExporting("excel");
    try {
      const { exportDuesToExcel } = await import("@/lib/export-excel");
      await exportDuesToExcel(dues, month);
      toast.success("Excel exported successfully");
    } catch {
      toast.error("Failed to export Excel");
    } finally {
      setExporting(null);
    }
  }

  return (
    <div>
      <PageHeader
        title="Pending Dues"
        subtitle={`${month} — ${overdueCount} student${overdueCount !== 1 ? "s" : ""} with outstanding balance`}
        actions={
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={FileDown}
              loading={exporting === "pdf"}
              onClick={handleExportPDF}
            >
              PDF
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={FileSpreadsheet}
              loading={exporting === "excel"}
              onClick={handleExportExcel}
            >
              Excel
            </Button>
          </div>
        }
      />

      {isDemoMode && <DemoBanner />}

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        <div className="bg-[#111] border border-[#1e1e1e] rounded-xl p-4">
          <p className="text-xs text-[#888] mb-1">Total Pending</p>
          <p className="text-xl font-bold text-[#cc6600]">{formatCurrency(totalPending)}</p>
        </div>
        <div className="bg-[#111] border border-[#1e1e1e] rounded-xl p-4">
          <p className="text-xs text-[#888] mb-1">Students Owing</p>
          <p className="text-xl font-bold text-white">{overdueCount}</p>
        </div>
        <div className="bg-[#111] border border-[#1e1e1e] rounded-xl p-4 col-span-2 sm:col-span-1">
          <p className="text-xs text-[#888] mb-1">Total Collected</p>
          <p className="text-xl font-bold text-emerald-400">
            {formatCurrency(dues.reduce((s, d) => s + d.total_paid, 0))}
          </p>
        </div>
      </div>

      <DataTable
        data={dues}
        keyExtractor={(d) => d.student.id}
        emptyMessage="No dues data for this month."
        columns={[
          {
            key: "name",
            header: "Student",
            cell: (d) => <span className="font-medium text-white">{d.student.name}</span>,
          },
          {
            key: "batch",
            header: "Batch",
            cell: (d) => (
              <span className="text-xs text-[#888]">{d.batch?.name ?? "—"}</span>
            ),
          },
          {
            key: "present",
            header: "Days",
            cell: (d) => <span className="text-[#ddd]">{d.present_days}</span>,
          },
          {
            key: "fees",
            header: "Generated",
            cell: (d) => <span className="text-[#ddd]">{formatCurrency(d.generated_fees)}</span>,
          },
          {
            key: "paid",
            header: "Paid",
            cell: (d) => <span className="text-emerald-400">{formatCurrency(d.total_paid)}</span>,
          },
          {
            key: "pending",
            header: "Pending",
            cell: (d) => (
              <span className={d.pending > 0 ? "font-semibold text-red-400" : "text-[#555]"}>
                {d.pending > 0 ? formatCurrency(d.pending) : "Clear"}
              </span>
            ),
          },
        ]}
      />
    </div>
  );
}
