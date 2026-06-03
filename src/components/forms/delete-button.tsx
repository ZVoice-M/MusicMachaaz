"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function DeleteButton({ url, label = "Delete" }: { url: string; label?: string }) {
  const router = useRouter();

  async function remove() {
    if (!confirm(`Delete this ${label.toLowerCase()}?`)) return;
    const response = await fetch(url, { method: "DELETE" });
    if (!response.ok) {
      toast.error((await response.json()).error ?? "Unable to delete");
      return;
    }
    toast.success(`${label} deleted`);
    router.refresh();
  }

  return (
    <Button variant="danger" onClick={remove}>
      <Trash2 size={16} /> {label}
    </Button>
  );
}
