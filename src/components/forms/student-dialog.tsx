"use client";

import { useState } from "react";
import { Plus, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Select, Textarea } from "@/components/ui/input";
import type { Batch, Student } from "@/types/database";

export function StudentDialog({ batches, student }: { batches: Batch[]; student?: Student }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const body = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch(student ? `/api/students/${student.id}` : "/api/students", {
      method: student ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, active: body.active === "on" }),
    });
    setSaving(false);
    if (!response.ok) {
      toast.error((await response.json()).error ?? "Unable to save student");
      return;
    }
    toast.success(student ? "Student updated" : "Student added");
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} variant={student ? "secondary" : "primary"}>
        {student ? <Pencil size={16} /> : <Plus size={16} />} {student ? "Edit Student" : "Add Student"}
      </Button>
      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
          <Card className="w-full max-w-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">{student ? "Edit Student" : "Add Student"}</h2>
              <Button variant="ghost" onClick={() => setOpen(false)} type="button">Close</Button>
            </div>
            <form onSubmit={submit} className="grid gap-4">
              <Input name="student_name" required defaultValue={student?.student_name} placeholder="Student name" />
              <Input name="mobile" required defaultValue={student?.mobile} placeholder="Mobile number" />
              <Select name="batch_id" required defaultValue={student?.batch_id ?? ""}>
                <option value="" disabled>Select batch</option>
                {batches.map((batch) => <option key={batch.id} value={batch.id}>{batch.batch_name}</option>)}
              </Select>
              <Input name="joining_date" type="date" defaultValue={student?.joining_date ?? ""} />
              <Textarea name="notes" defaultValue={student?.notes ?? ""} placeholder="Notes" />
              <label className="flex items-center gap-2 text-sm text-muted">
                <input name="active" type="checkbox" defaultChecked={student?.active ?? true} /> Active student
              </label>
              <Button disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
            </form>
          </Card>
        </div>
      ) : null}
    </>
  );
}
