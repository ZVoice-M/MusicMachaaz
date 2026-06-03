import { hasSupabaseEnv, supabaseAnonKey, supabaseUrl } from "@/lib/supabase";

export type SystemStatus = {
  state: "operational" | "degraded" | "unavailable" | "demo";
  label: string;
  message: string;
  checkedAt: string;
  responseTimeMs?: number;
};

export async function getSystemStatus(): Promise<SystemStatus> {
  const checkedAt = new Date().toISOString();

  if (!hasSupabaseEnv()) {
    return {
      state: "demo",
      label: "Demo mode",
      message: "Supabase environment variables are not configured. The app is showing demo data and writes are not persisted.",
      checkedAt,
    };
  }

  const startedAt = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/settings?select=id&limit=1`, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      cache: "no-store",
      signal: controller.signal,
    });
    const responseTimeMs = Date.now() - startedAt;

    if (response.ok) {
      return {
        state: "operational",
        label: "Operational",
        message: "Supabase is responding normally. Login, attendance, payments, and reports should be available.",
        checkedAt,
        responseTimeMs,
      };
    }

    if ([402, 429, 503, 504].includes(response.status)) {
      return {
        state: "degraded",
        label: "Temporarily limited",
        message: "Supabase is reachable but may be paused, rate-limited, or temporarily constrained by free-tier limits. Wait a few minutes, then refresh.",
        checkedAt,
        responseTimeMs,
      };
    }

    return {
      state: "degraded",
      label: "Configuration check needed",
      message: `Supabase responded with HTTP ${response.status}. Check environment variables, RLS policies, and project availability.`,
      checkedAt,
      responseTimeMs,
    };
  } catch {
    return {
      state: "unavailable",
      label: "Temporarily unavailable",
      message: "The app could not reach Supabase. On the free tier, a paused project or temporary quota limitation can make the system unavailable until Supabase resumes service.",
      checkedAt,
      responseTimeMs: Date.now() - startedAt,
    };
  } finally {
    clearTimeout(timeout);
  }
}
