import { AlertCircle } from "lucide-react";

export function DemoBanner() {
  return (
    <div className="w-full bg-[#cc6600]/10 border border-[#cc6600]/30 rounded-lg px-4 py-3 flex items-start gap-3 mb-4">
      <AlertCircle size={16} className="text-[#cc6600] mt-0.5 shrink-0" />
      <div className="text-sm">
        <span className="text-[#cc6600] font-semibold">Demo Mode — </span>
        <span className="text-[#aaa]">
          Supabase is not connected. You&apos;re viewing sample data. Add{" "}
          <code className="bg-white/10 px-1 rounded text-xs">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code className="bg-white/10 px-1 rounded text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
          to <code className="bg-white/10 px-1 rounded text-xs">.env.local</code> to connect a real database.
        </span>
      </div>
    </div>
  );
}
