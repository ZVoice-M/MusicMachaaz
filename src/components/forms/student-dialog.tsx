"use client";

import { useState } from "react";
import { Plus, Pencil, X } from "lucide-react";
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
        {student ? <Pencil size={16} /> : <Plus size={16} />}
        {student ? "Edit" : "Add Student"}
      </Button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 p-0 sm:p-4">
          <Card className="w-full sm:max-w-xl rounded-b-none sm:rounded-xl max-h-[90dvh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 sticky top-0 bg-panel pt-1 pb-3 border-b border-border">
              <h2 className="text-lg font-bold">{student ? "Edit Student" : "Add Student"}</h2>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-md text-muted hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={submit} className="grid gap-4 pb-4">
              <Input name="student_name" required defaultValue={student?.student_name} placeholder="Student name" />
              <Input name="mobile" required defaultValue={student?.mobile} placeholder="Mobile number" inputMode="tel" />
              <Select name="batch_id" required defaultValue={student?.batch_id ?? ""}>
                <option value="" disabled>Select batch</option>
                {batches.map((b) => <option key={b.id} value={b.id}>{b.batch_name}</option>)}
              </Select>
              <Input name="joining_date" type="date" defaultValue={student?.joining_date ?? ""} />
              <Textarea name="notes" defaultValue={student?.notes ?? ""} placeholder="Notes (optional)" />
              <label className="flex items-center gap-2 text-sm text-muted">
                <input name="active" type="checkbox" defaultChecked={student?.active ?? true} className="accent-gold" />
                Active student
              </label>
              <div className="flex gap-2">
                <Button className="flex-1" disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
                <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </>
  );
}
