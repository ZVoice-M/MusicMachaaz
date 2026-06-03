"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { hasSupabaseEnv } from "@/lib/supabase";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);

    if (!hasSupabaseEnv()) {
      toast.info("Demo mode active. Add Supabase env vars to enable authentication.");
      router.replace("/dashboard");
      return;
    }

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: String(form.get("email")),
      password: String(form.get("password")),
    });
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome back");
    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm text-muted">Email</label>
        <Input name="email" type="email" required placeholder="admin@musicmachaanz.com" />
      </div>
      <div>
        <label className="mb-2 block text-sm text-muted">Password</label>
        <Input name="password" type="password" required placeholder="Password" />
      </div>
      <Button className="w-full" disabled={loading}>
        {loading ? "Signing in..." : "Sign in"}
      </Button>
      <Link href="/status" className="block text-center text-sm text-gold">
        Check system status
      </Link>
    </form>
  );
}
