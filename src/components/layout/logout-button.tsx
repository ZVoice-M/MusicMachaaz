"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { hasSupabaseEnv } from "@/lib/supabase";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    if (hasSupabaseEnv()) {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
    }
    toast.success("Logged out");
    router.replace("/login");
    router.refresh();
  }

  return (
    <Button variant="ghost" className="w-full justify-start" onClick={logout}>
      <LogOut size={16} /> Logout
    </Button>
  );
}
