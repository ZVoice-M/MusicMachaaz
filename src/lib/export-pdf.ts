"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { StudentDueSummary } from "@/types";
import { formatCurrency } from "./utils";

/**
 * Export pending dues to a styled PDF.
 */
export function exportDuesToPDF(
  dues: StudentDueSummary[],
  month: string
): void {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const GOLD = [204, 102, 0] as [number, number, number];
  const BLACK = [10, 10, 10] as [number, number, number];
  const WHITE = [255, 255, 255] as [number, number, number];

  // ── Header band ───────────────────────────────────────────────────────────
  doc.setFillColor(...BLACK);
  doc.rect(0, 0, 210, 28, "F");

  doc.setFontSize(18);
  doc.setTextColor(...GOLD);
  doc.setFont("helvetica", "bold");
  doc.text("Music Machaanz Academy", 14, 13);

  doc.setFontSize(10);
  doc.setTextColor(...WHITE);
  doc.setFont("helvetica", "normal");
  doc.text(`Pending Dues — ${month}`, 14, 21);

  doc.setFontSize(9);
  doc.text(`Generated on ${new Date().toLocaleDateString("en-IN")}`, 196, 21, { align: "right" });

  // ── Table ─────────────────────────────────────────────────────────────────
  const rows = dues.map((d) => [
    d.student.name,
    d.batch?.name ?? "—",
    String(d.present_days),
    formatCurrency(d.generated_fees),
    formatCurrency(d.total_paid),
    formatCurrency(d.pending),
  ]);

  const totals = [
    "TOTAL",
    "",
    String(dues.reduce((s, d) => s + d.present_days, 0)),
    formatCurrency(dues.reduce((s, d) => s + d.generated_fees, 0)),
    formatCurrency(dues.reduce((s, d) => s + d.total_paid, 0)),
    formatCurrency(dues.reduce((s, d) => s + d.pending, 0)),
  ];

  autoTable(doc, {
    startY: 34,
    head: [["Student", "Batch", "Present Days", "Generated Fees", "Total Paid", "Pending"]],
    body: [...rows, totals],
    headStyles: {
      fillColor: BLACK,
      textColor: GOLD,
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: { fontSize: 9, textColor: [30, 30, 30] },
    alternateRowStyles: { fillColor: [248, 248, 248] },
    didParseCell(data) {
      // Highlight total row
      if (data.row.index === rows.length) {
        data.cell.styles.fillColor = GOLD;
        data.cell.styles.textColor = WHITE;
        data.cell.styles.fontStyle = "bold";
      }
      // Highlight overdue pending cells
      if (
        data.column.index === 5 &&
        data.row.index < rows.length &&
        dues[data.row.index]?.pending > 0
      ) {
        data.cell.styles.textColor = [192, 57, 43];
        data.cell.styles.fontStyle = "bold";
      }
    },
    margin: { left: 14, right: 14 },
  });

  doc.save(`dues-${month}.pdf`);
}
