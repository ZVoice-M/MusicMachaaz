import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  className?: string;
}

export function StatCard({ label, value, icon: Icon, trend, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[#1e1e1e] bg-[#111] p-5 flex flex-col gap-3",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#888] font-medium uppercase tracking-wider">{label}</span>
        <div className="w-8 h-8 rounded-lg bg-[#cc6600]/15 flex items-center justify-center">
          <Icon size={16} className="text-[#cc6600]" />
        </div>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {trend && (
        <p className={cn("text-xs", trend.positive ? "text-emerald-400" : "text-red-400")}>
          {trend.positive ? "▲" : "▼"} {trend.value}
        </p>
      )}
    </div>
  );
}
