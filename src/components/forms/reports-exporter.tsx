"use client";

import { Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { currency } from "@/lib/utils";
import type { StudentLedger } from "@/types/database";

export function ReportsExporter({
  rows,
  currencyCode,
  title = "Music Machaanz Academy Report",
  fileName = "music-machaanz-report",
}: {
  rows: StudentLedger[];
  currencyCode: string;
  title?: string;
  fileName?: string;
}) {
  const table = rows.map((row) => ({
    Student: row.student_name,
    Batch: row.batches?.batch_name ?? "-",
    Present: row.present_days,
    Generated: row.generated_fees,
    Paid: row.paid_amount,
    Pending: row.pending_amount,
  }));

  function exportExcel() {
    const sheet = XLSX.utils.json_to_sheet(table);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "Reports");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  }

  function exportPdf() {
    const doc = new jsPDF();
    doc.text(title, 14, 16);
    autoTable(doc, {
      startY: 24,
      head: [["Student", "Batch", "Present", "Generated", "Paid", "Pending"]],
      body: rows.map((row) => [
        row.student_name,
        row.batches?.batch_name ?? "-",
        row.present_days,
        currency(row.generated_fees, currencyCode),
        currency(row.paid_amount, currencyCode),
        currency(row.pending_amount, currencyCode),
      ]),
    });
    doc.save(`${fileName}.pdf`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={exportPdf}><Download size={16} /> PDF</Button>
      <Button variant="secondary" onClick={exportExcel}><Download size={16} /> Excel</Button>
    </div>
  );
}
