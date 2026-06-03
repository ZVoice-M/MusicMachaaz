"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@/components/ui/button";
import { currency } from "@/lib/utils";
import type { StudentLedger } from "@/types/database";
import { toast } from "sonner";

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
  const [exporting, setExporting] = useState<"pdf" | "excel" | null>(null);

  function exportPdf() {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.setTextColor(212, 175, 55); // gold
    doc.text("Music Machaanz · Subin", 14, 12);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.text(title, 14, 20);
    autoTable(doc, {
      startY: 28,
      head: [["Student", "Batch", "Present", "Generated", "Paid", "Pending"]],
      body: rows.map((row) => [
        row.student_name,
        row.batches?.batch_name ?? "-",
        row.present_days,
        currency(row.generated_fees, currencyCode),
        currency(row.paid_amount, currencyCode),
        currency(row.pending_amount, currencyCode),
      ]),
      headStyles: { fillColor: [30, 30, 30], textColor: [212, 175, 55] },
      alternateRowStyles: { fillColor: [24, 24, 24] },
      styles: { textColor: [220, 220, 220] },
    });
    doc.save(`${fileName}.pdf`);
  }

  async function exportExcel() {
    setExporting("excel");
    try {
      // Dynamic import so ExcelJS isn't in the main bundle
      const ExcelJS = (await import("exceljs")).default;
      const workbook = new ExcelJS.Workbook();
      workbook.creator = "Music Machaanz Academy – Subin";
      workbook.created = new Date();

      const sheet = workbook.addWorksheet("Report");
      sheet.columns = [
        { header: "Student", key: "student", width: 26 },
        { header: "Batch", key: "batch", width: 18 },
        { header: "Present Days", key: "present", width: 14 },
        { header: "Generated (₹)", key: "generated", width: 16 },
        { header: "Paid (₹)", key: "paid", width: 14 },
        { header: "Pending (₹)", key: "pending", width: 14 },
      ];

      // Style header row
      const headerRow = sheet.getRow(1);
      headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFD4AF37" }, name: "Calibri" };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1A1A1A" } };
        cell.alignment = { vertical: "middle", horizontal: "center" };
      });
      headerRow.height = 20;

      rows.forEach((row, i) => {
        const r = sheet.addRow({
          student: row.student_name,
          batch: row.batches?.batch_name ?? "-",
          present: row.present_days,
          generated: row.generated_fees,
          paid: row.paid_amount,
          pending: row.pending_amount,
        });
        const bg = i % 2 === 0 ? "FF181818" : "FF222222";
        r.eachCell((cell) => {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bg } };
          cell.font = { color: { argb: "FFDCDCDC" }, name: "Calibri" };
          cell.alignment = { vertical: "middle", horizontal: "center" };
        });
        if (row.pending_amount > 0) {
          r.getCell("pending").font = { bold: true, color: { argb: "FFEF4444" }, name: "Calibri" };
        }
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileName}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Excel exported");
    } catch (err) {
      console.error(err);
      toast.error("Excel export failed");
    } finally {
      setExporting(null);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={exportPdf}>
        <Download size={16} /> PDF
      </Button>
      <Button variant="secondary" onClick={exportExcel} disabled={exporting === "excel"}>
        <Download size={16} /> {exporting === "excel" ? "Exporting…" : "Excel"}
      </Button>
    </div>
  );
}
