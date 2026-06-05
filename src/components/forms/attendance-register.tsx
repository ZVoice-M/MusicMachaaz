"use client";

import { getDaysInMonth } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import type { Attendance, AttendanceStatus, Batch, Student } from "@/types/database";

const statuses: AttendanceStatus[] = ["Present", "Absent", "Leave", "Holiday"];
const tone: Record<AttendanceStatus, "green" | "red" | "yellow" | "blue"> = {
  Present: "green", Absent: "red", Leave: "yellow", Holiday: "blue",
};
const shortLabel: Record<AttendanceStatus, string> = {
  Present: "P", Absent: "A", Leave: "L", Holiday: "H",
};
const buttonClass: Record<AttendanceStatus, string> = {
  Present: "border-green-400/40 bg-green-400/10 text-green-200 hover:bg-green-400/20",
  Absent: "border-red-400/40 bg-red-400/10 text-red-200 hover:bg-red-400/20",
  Leave: "border-yellow-300/40 bg-yellow-300/10 text-yellow-100 hover:bg-yellow-300/20",
  Holiday: "border-blue-300/40 bg-blue-300/10 text-blue-100 hover:bg-blue-300/20",
};

function toDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

const now = new Date();
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const YEARS = Array.from({ length: 3 }, (_, i) => now.getFullYear() - i);

export function AttendanceRegister({
  students,
  batches,
  attendance,
}: {
  students: Student[];
  batches: Batch[];
  attendance: Attendance[];
}) {
  const [batchId, setBatchId] = useState("");
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [records, setRecords] = useState(attendance);
  const [view, setView] = useState<"day" | "month">("day");
  const [selectedDay, setSelectedDay] = useState(now.getDate());

  const visibleStudents = batchId
    ? students.filter((s) => s.batch_id === batchId)
    : students;

  const daysInMonth = getDaysInMonth(new Date(year, month - 1));
  const selectedDate = toDateStr(year, month, selectedDay);

  function getStatus(studentId: string, date: string): AttendanceStatus | undefined {
    return records.find((r) => r.student_id === studentId && r.attendance_date === date)?.status;
  }

  async function save(studentId: string, status: AttendanceStatus, date: string) {
    setRecords((prev) => [
      ...prev.filter((r) => !(r.student_id === studentId && r.attendance_date === date)),
      { id: `${studentId}-${date}`, student_id: studentId, attendance_date: date, status, created_at: new Date().toISOString() },
    ]);
    const res = await fetch("/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ student_id: studentId, attendance_date: date, status }),
    });
    if (!res.ok) toast.error("Could not save attendance");
  }

  async function bulk(status: AttendanceStatus) {
    await Promise.all(visibleStudents.map((s) => save(s.id, status, selectedDate)));
    toast.success(`Marked ${visibleStudents.length} students as ${status}`);
  }

  const daySummary = statuses.map((s) => ({
    status: s,
    count: visibleStudents.filter((st) => getStatus(st.id, selectedDate) === s).length,
  }));
  const unmarked = visibleStudents.length - daySummary.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_1fr_auto]">
        <Select value={String(month)} onChange={(e) => { setMonth(Number(e.target.value)); setSelectedDay(1); }}>
          {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
        </Select>
        <Select value={String(year)} onChange={(e) => setYear(Number(e.target.value))}>
          {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
        </Select>
        <Select value={batchId} onChange={(e) => setBatchId(e.target.value)}>
          <option value="">All batches</option>
          {batches.map((b) => <option key={b.id} value={b.id}>{b.batch_name}</option>)}
        </Select>
        <div className="flex gap-2">
          <Button variant={view === "day" ? "primary" : "secondary"} onClick={() => setView("day")}>Day</Button>
          <Button variant={view === "month" ? "primary" : "secondary"} onClick={() => setView("month")}>Month</Button>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-black/20 px-4 py-2.5 flex items-center justify-between">
        <p className="font-semibold text-white">{MONTHS[month - 1]} {year}</p>
        <p className="text-xs text-muted">{visibleStudents.length} students</p>
      </div>

      {view === "day" && (
        <>
          <div className="flex flex-wrap gap-1.5">
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
              const date = toDateStr(year, month, d);
              const anyMarked = visibleStudents.some((s) => getStatus(s.id, date));
              return (
                <button
                  key={d}
                  onClick={() => setSelectedDay(d)}
                  className={`h-8 w-8 rounded-md text-xs font-semibold transition-colors border
                    ${selectedDay === d
                      ? "bg-gold text-black border-gold"
                      : anyMarked
                        ? "bg-green-400/10 border-green-400/30 text-green-300"
                        : "border-border text-muted hover:border-gold/50 hover:text-white"
                    }`}
                >
                  {d}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {daySummary.map((item) => (
              <Badge key={item.status} tone={tone[item.status]}>{item.status}: {item.count}</Badge>
            ))}
            <Badge>Unmarked: {unmarked}</Badge>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button variant="secondary" onClick={() => bulk("Present")}>All Present</Button>
            <Button variant="secondary" onClick={() => bulk("Absent")}>All Absent</Button>
            <Button variant="secondary" onClick={() => bulk("Holiday")}>Holiday</Button>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {visibleStudents.map((student) => {
              const status = getStatus(student.id, selectedDate);
              return (
                <Card key={student.id} className="p-3">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="truncate text-base font-semibold">{student.student_name}</h2>
                      <p className="truncate text-xs text-muted">{student.batches?.batch_name ?? "No batch"}</p>
                    </div>
                    {status ? <Badge tone={tone[status]}>{status}</Badge> : <Badge>Pending</Badge>}
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {statuses.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => save(student.id, item, selectedDate)}
                        className={`min-h-12 rounded-md border px-2 text-center text-xs font-semibold transition ${buttonClass[item]} ${status === item ? "ring-2 ring-gold" : ""}`}
                        aria-pressed={status === item}
                      >
                        <span className="block text-base">{shortLabel[item]}</span>
                        <span className="hidden sm:block">{item}</span>
                      </button>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {view === "month" && (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-black/40">
                <th className="sticky left-0 z-10 bg-[#181818] px-3 py-2 text-left font-semibold text-muted whitespace-nowrap">Student</th>
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
                  <th key={d} className="px-1.5 py-2 text-center font-semibold text-muted w-8">{d}</th>
                ))}
                <th className="px-2 py-2 text-center font-semibold text-green-400">P</th>
                <th className="px-2 py-2 text-center font-semibold text-red-400">A</th>
                <th className="px-2 py-2 text-center font-semibold text-yellow-400">L</th>
                <th className="px-2 py-2 text-center font-semibold text-blue-400">H</th>
              </tr>
            </thead>
            <tbody>
              {visibleStudents.map((student, i) => {
                const counts = statuses.map((s) =>
                  Array.from({ length: daysInMonth }, (_, d) =>
                    getStatus(student.id, toDateStr(year, month, d + 1)) === s
                  ).filter(Boolean).length
                );
                return (
                  <tr key={student.id} className={i % 2 === 0 ? "bg-black/10" : "bg-black/20"}>
                    <td className="sticky left-0 z-10 bg-inherit px-3 py-1.5 font-medium text-white whitespace-nowrap border-r border-border">
                      {student.student_name}
                    </td>
                    {Array.from({ length: daysInMonth }, (_, d) => {
                      const date = toDateStr(year, month, d + 1);
                      const st = getStatus(student.id, date);
                      const colors: Record<string, string> = {
                        Present: "bg-green-500/20 text-green-300",
                        Absent: "bg-red-500/20 text-red-300",
                        Leave: "bg-yellow-500/20 text-yellow-300",
                        Holiday: "bg-blue-500/20 text-blue-300",
                      };
                      return (
                        <td key={d} className="px-0.5 py-1 text-center">
                          <button
                            onClick={() => {
                              const next = st
                                ? statuses[(statuses.indexOf(st) + 1) % statuses.length]
                                : statuses[0];
                              save(student.id, next, date);
                            }}
                            className={`h-6 w-6 rounded text-[10px] font-bold transition-colors border border-transparent hover:border-gold/40
                              ${st ? colors[st] : "text-muted hover:bg-white/5"}`}
                            title={st ?? "Unmarked"}
                          >
                            {st ? shortLabel[st] : "·"}
                          </button>
                        </td>
                      );
                    })}
                    {counts.map((c, idx) => (
                      <td key={idx} className={`px-2 py-1 text-center font-semibold ${["text-green-400","text-red-400","text-yellow-400","text-blue-400"][idx]}`}>{c}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
