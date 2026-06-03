"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Eye, EyeOff } from "lucide-react";
import { createClient, isDemoMode } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (isDemoMode) {
      toast.success("Welcome, Subin! (Demo mode — no auth required)");
      router.push("/dashboard");
      return;
    }

    if (!email || !password) {
      toast.error("Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      if (!supabase) throw new Error("Supabase not configured");

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Login failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#cc6600] flex items-center justify-center mb-4 shadow-xl shadow-[#cc6600]/20">
            <GraduationCap size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Music Machaanz</h1>
          <p className="text-[#888] text-sm mt-1">Admin portal — Subin</p>
        </div>

        {/* Form card */}
        <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6 space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="subin@musicmachaanz.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            inputMode="email"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 bottom-2.5 text-[#666] hover:text-[#aaa] transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <Button className="w-full mt-2" loading={loading} onClick={handleLogin}>
            Sign in
          </Button>

          {isDemoMode && (
            <p className="text-center text-xs text-[#cc6600] bg-[#cc6600]/10 rounded-lg px-3 py-2">
              Demo mode — click Sign in to explore without credentials
            </p>
          )}
        </div>

        <p className="text-center text-xs text-[#555] mt-6">
          Music Machaanz Academy Management System
        </p>
      </div>
    </div>
  );
}
