"use client";

import { useState } from "react";
import { Music2, Pencil, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Batch } from "@/types/database";

export function BatchDialog({ batch }: { batch?: Batch }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const body = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch(batch ? `/api/batches/${batch.id}` : "/api/batches", {
      method: batch ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSaving(false);
    if (!response.ok) {
      toast.error((await response.json()).error ?? "Unable to save batch");
      return;
    }
    toast.success(batch ? "Batch updated" : "Batch added");
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} variant={batch ? "secondary" : "primary"}>
        {batch ? <Pencil size={16} /> : <Plus size={16} />} {batch ? "Edit Batch" : "Add Batch"}
      </Button>
      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
          <Card className="w-full max-w-md">
            <div className="mb-4 flex items-center gap-2">
              <Music2 className="text-gold" size={20} />
              <h2 className="text-lg font-bold">{batch ? "Edit Batch" : "Add Batch"}</h2>
            </div>
            <form onSubmit={submit} className="grid gap-4">
              <Input name="batch_name" required defaultValue={batch?.batch_name} placeholder="Guitar Batch A" />
              <div className="flex gap-2">
                <Button className="flex-1" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
                <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              </div>
            </form>
          </Card>
        </div>
      ) : null}
    </>
  );
}
