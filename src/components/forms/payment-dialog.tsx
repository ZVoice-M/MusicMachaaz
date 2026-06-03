"use client";

import { useState } from "react";
import { IndianRupee } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toDateInput } from "@/lib/utils";

export function PaymentDialog({ studentId, label = "Record Payment" }: { studentId: string; label?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const response = await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...Object.fromEntries(new FormData(event.currentTarget)), student_id: studentId }),
    });
    setSaving(false);
    if (!response.ok) {
      toast.error((await response.json()).error ?? "Unable to record payment");
      return;
    }
    toast.success("Payment recorded");
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}><IndianRupee size={16} /> {label}</Button>
      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
          <Card className="w-full max-w-md">
            <h2 className="mb-4 text-lg font-bold">Record Payment</h2>
            <form onSubmit={submit} className="grid gap-4">
              <Input name="amount" type="number" min="1" required placeholder="Amount paid" />
              <Input name="payment_date" type="date" required defaultValue={toDateInput()} />
              <Input name="remarks" placeholder="Partial payment, monthly fee, advance" />
              <div className="flex gap-2">
                <Button className="flex-1" disabled={saving}>{saving ? "Saving..." : "Save Payment"}</Button>
                <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              </div>
            </form>
          </Card>
        </div>
      ) : null}
    </>
  );
}
