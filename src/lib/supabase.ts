import { createBrowserClient } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isDemoMode =
  process.env.NEXT_PUBLIC_DEMO_MODE === "true" || !url || !key;

/** Browser Supabase client — safe to import in client components */
export function createClient() {
  if (isDemoMode) return null;
  return createBrowserClient(url, key);
}
