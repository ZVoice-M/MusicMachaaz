"use client";

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import type { StudentDueSummary } from "@/types";
import { formatCurrency } from "./utils";

/**
 * Export pending dues to an Excel file.
 * Uses ExcelJS which is actively maintained and has no known CVEs.
 */
export async function exportDuesToExcel(
  dues: StudentDueSummary[],
  month: string
): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Music Machaanz Academy";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Pending Dues");

  // ── Header row styling ────────────────────────────────────────────────────
  const GOLD = "FFCC6600";
  const BLACK = "FF0A0A0A";
  const WHITE = "FFFFFFFF";

  sheet.columns = [
    { header: "Student", key: "name", width: 28 },
    { header: "Batch", key: "batch", width: 18 },
    { header: "Present Days", key: "present", width: 14 },
    { header: "Generated Fees (₹)", key: "fees", width: 20 },
    { header: "Total Paid (₹)", key: "paid", width: 18 },
    { header: "Pending (₹)", key: "pending", width: 16 },
  ];

  // Style header row
  const headerRow = sheet.getRow(1);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: WHITE }, name: "Calibri", size: 11 };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BLACK } };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      bottom: { style: "medium", color: { argb: GOLD } },
    };
  });
  headerRow.height = 24;

  // ── Data rows ─────────────────────────────────────────────────────────────
  dues.forEach((d, i) => {
    const row = sheet.addRow({
      name: d.student.name,
      batch: d.batch?.name ?? "—",
      present: d.present_days,
      fees: d.generated_fees,
      paid: d.total_paid,
      pending: d.pending,
    });

    const isEven = i % 2 === 0;
    row.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: isEven ? "FFF5F5F5" : WHITE },
      };
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });

    // Highlight overdue rows in muted red
    if (d.pending > 0) {
      row.getCell("pending").font = { color: { argb: "FFC0392B" }, bold: true };
    }
  });

  // ── Totals row ────────────────────────────────────────────────────────────
  const totalRow = sheet.addRow({
    name: "TOTAL",
    batch: "",
    present: dues.reduce((s, d) => s + d.present_days, 0),
    fees: dues.reduce((s, d) => s + d.generated_fees, 0),
    paid: dues.reduce((s, d) => s + d.total_paid, 0),
    pending: dues.reduce((s, d) => s + d.pending, 0),
  });
  totalRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: WHITE }, name: "Calibri" };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: GOLD } };
    cell.alignment = { vertical: "middle", horizontal: "center" };
  });

  // ── Metadata ──────────────────────────────────────────────────────────────
  sheet.insertRow(1, [`Music Machaanz Academy — Pending Dues: ${month}`]);
  const titleRow = sheet.getRow(1);
  titleRow.font = { bold: true, size: 13, name: "Calibri" };
  titleRow.height = 28;
  sheet.mergeCells(1, 1, 1, 6);
  titleRow.getCell(1).alignment = { horizontal: "center" };

  // ── Export ────────────────────────────────────────────────────────────────
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `dues-${month}.xlsx`);
}
