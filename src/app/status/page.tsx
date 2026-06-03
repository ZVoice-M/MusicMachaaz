"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertCircle, RefreshCw, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

type HealthStatus = "checking" | "ok" | "error" | "unconfigured";

export default function StatusPage() {
  const [status, setStatus] = useState<HealthStatus>("checking");
  const [latency, setLatency] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function checkHealth() {
    setStatus("checking");
    setError(null);

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      setStatus("unconfigured");
      return;
    }

    const start = Date.now();
    try {
      const res = await fetch(`${url}/rest/v1/`, {
        headers: { apikey: key },
        signal: AbortSignal.timeout(8000),
      });
      setLatency(Date.now() - start);
      setStatus(res.ok || res.status === 404 ? "ok" : "error");
      if (!res.ok && res.status !== 404) setError(`HTTP ${res.status}`);
    } catch (e) {
      setLatency(Date.now() - start);
      setStatus("error");
      setError(e instanceof Error ? e.message : "Network error");
    }
  }

  useEffect(() => { checkHealth(); }, []);

  const icons = {
    checking: <RefreshCw size={32} className="text-[#888] animate-spin" />,
    ok: <CheckCircle size={32} className="text-emerald-400" />,
    error: <XCircle size={32} className="text-red-400" />,
    unconfigured: <AlertCircle size={32} className="text-[#cc6600]" />,
  };

  const messages: Record<HealthStatus, { title: string; body: string }> = {
    checking: { title: "Checking connectivity…", body: "Reaching out to Supabase." },
    ok: { title: "All systems operational", body: `Supabase is reachable${latency != null ? ` (${latency}ms)` : ""}.` },
    error: { title: "Supabase unreachable", body: `Could not connect${error ? `: ${error}` : ""}. If you're on the free tier, the project may be paused after 7 days of inactivity. Visit your Supabase dashboard to resume it.` },
    unconfigured: { title: "Running in demo mode", body: "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are not set. The app is showing demo data. Add these to .env.local to connect a real database." },
  };

  const { title, body } = messages[status];

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-md bg-[#cc6600] flex items-center justify-center">
            <GraduationCap size={18} className="text-white" />
          </div>
          <span className="font-semibold text-white">Music Machaanz</span>
        </div>

        <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-8">
          <div className="flex justify-center mb-4">{icons[status]}</div>
          <h1 className="text-lg font-bold text-white mb-2">{title}</h1>
          <p className="text-sm text-[#888] leading-relaxed">{body}</p>

          <div className="flex flex-col gap-2 mt-6">
            <Button variant="secondary" icon={RefreshCw} onClick={checkHealth} loading={status === "checking"}>
              Check again
            </Button>
            <Link href="/login">
              <Button variant="ghost" className="w-full">Back to login</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
