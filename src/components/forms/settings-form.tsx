"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Settings } from "@/types/database";

export function SettingsForm({ settings }: { settings: Settings }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const response = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))),
    });
    setSaving(false);
    if (!response.ok) {
      toast.error((await response.json()).error ?? "Unable to save settings");
      return;
    }
    toast.success("Settings updated");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <Input name="institute_name" defaultValue={settings.institute_name ?? "Music Machaanz"} />
      <Input name="fee_per_day" type="number" min="0" defaultValue={settings.fee_per_day} />
      <Input name="currency" maxLength={3} defaultValue={settings.currency} />
      <Button disabled={saving}>{saving ? "Saving..." : "Save Settings"}</Button>
    </form>
  );
}
