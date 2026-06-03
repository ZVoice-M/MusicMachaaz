"use client";

import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toDateInput } from "@/lib/utils";
import type { Attendance, AttendanceStatus, Batch, Student } from "@/types/database";

const statuses: AttendanceStatus[] = ["Present", "Absent", "Leave", "Holiday"];
const tone: Record<AttendanceStatus, "green" | "red" | "yellow" | "blue"> = {
  Present: "green",
  Absent: "red",
  Leave: "yellow",
  Holiday: "blue",
};
const shortLabel: Record<AttendanceStatus, string> = {
  Present: "P",
  Absent: "A",
  Leave: "L",
  Holiday: "H",
};
const buttonClass: Record<AttendanceStatus, string> = {
  Present: "border-green-400/40 bg-green-400/10 text-green-200 hover:bg-green-400/20",
  Absent: "border-red-400/40 bg-red-400/10 text-red-200 hover:bg-red-400/20",
  Leave: "border-yellow-300/40 bg-yellow-300/10 text-yellow-100 hover:bg-yellow-300/20",
  Holiday: "border-blue-300/40 bg-blue-300/10 text-blue-100 hover:bg-blue-300/20",
};

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
  const [selectedDate, setSelectedDate] = useState(toDateInput());
  const [records, setRecords] = useState(attendance);
  const visibleStudents = batchId ? students.filter((student) => student.batch_id === batchId) : students;
  const date = new Date(`${selectedDate}T00:00:00`);

  function current(studentId: string) {
    return records.find((item) => item.student_id === studentId && item.attendance_date === selectedDate)?.status;
  }

  async function save(studentId: string, status: AttendanceStatus) {
    setRecords((prev) => [
      ...prev.filter((item) => !(item.student_id === studentId && item.attendance_date === selectedDate)),
      { id: `${studentId}-${selectedDate}`, student_id: studentId, attendance_date: selectedDate, status, created_at: new Date().toISOString() },
    ]);
    const response = await fetch("/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ student_id: studentId, attendance_date: selectedDate, status }),
    });
    if (!response.ok) toast.error("Attendance could not be saved");
  }

  async function bulk(status: AttendanceStatus) {
    await Promise.all(visibleStudents.map((student) => save(student.id, status)));
    toast.success(`Marked ${visibleStudents.length} students ${status}`);
  }

  const summary = statuses.map((status) => ({
    status,
    count: visibleStudents.filter((student) => current(student.id) === status).length,
  }));
  const unmarked = visibleStudents.length - summary.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-[12rem_1fr]">
        <input
          type="date"
          value={selectedDate}
          onChange={(event) => setSelectedDate(event.target.value)}
          className="h-11 rounded-md border border-border bg-[#101010] px-3 text-sm text-white outline-none focus:border-gold"
        />
        <Select value={batchId} onChange={(event) => setBatchId(event.target.value)}>
          <option value="">All batches</option>
          {batches.map((batch) => <option key={batch.id} value={batch.id}>{batch.batch_name}</option>)}
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {summary.map((item) => <Badge key={item.status} tone={tone[item.status]}>{item.status}: {item.count}</Badge>)}
        <Badge>Unmarked: {unmarked}</Badge>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Button variant="secondary" onClick={() => bulk("Present")}>All Present</Button>
        <Button variant="secondary" onClick={() => bulk("Absent")}>All Absent</Button>
        <Button variant="secondary" onClick={() => bulk("Holiday")}>Holiday</Button>
      </div>
      <div className="rounded-lg border border-border bg-black/20 p-3">
        <p className="text-sm font-semibold text-white">{format(date, "EEEE, dd MMM yyyy")}</p>
        <p className="mt-1 text-xs text-muted">Tap one status per student. Changes auto-save immediately.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {visibleStudents.map((student) => {
          const status = current(student.id);
          return (
            <Card key={student.id} className="p-3">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-base font-semibold">{student.student_name}</h2>
                  <p className="truncate text-xs text-muted">{student.batches?.batch_name ?? "No batch"} · {student.mobile}</p>
                </div>
                {status ? <Badge tone={tone[status]}>{status}</Badge> : <Badge>Pending</Badge>}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {statuses.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => save(student.id, item)}
                    className={`min-h-12 rounded-md border px-2 text-center text-xs font-semibold transition ${buttonClass[item]} ${status === item ? "ring-2 ring-gold" : ""}`}
                    aria-pressed={status === item}
                    aria-label={`${student.student_name} ${item}`}
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
    </div>
  );
}
