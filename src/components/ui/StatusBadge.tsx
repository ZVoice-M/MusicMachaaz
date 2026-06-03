import { cn } from "@/lib/utils";
import type { AttendanceStatus } from "@/types";

const STATUS_STYLES: Record<AttendanceStatus, string> = {
  present: "bg-emerald-950 text-emerald-400 border-emerald-900",
  absent: "bg-red-950 text-red-400 border-red-900",
  leave: "bg-yellow-950 text-yellow-400 border-yellow-900",
  holiday: "bg-blue-950 text-blue-400 border-blue-900",
};

const STATUS_LABELS: Record<AttendanceStatus, string> = {
  present: "P",
  absent: "A",
  leave: "L",
  holiday: "H",
};

const STATUS_FULL: Record<AttendanceStatus, string> = {
  present: "Present",
  absent: "Absent",
  leave: "Leave",
  holiday: "Holiday",
};

interface StatusBadgeProps {
  status: AttendanceStatus;
  compact?: boolean;
  interactive?: boolean;
  onClick?: () => void;
}

export function StatusBadge({ status, compact = false, interactive = false, onClick }: StatusBadgeProps) {
  const base = cn(
    "inline-flex items-center justify-center rounded font-semibold border text-[10px] select-none",
    compact ? "w-6 h-6" : "px-2 py-0.5 text-xs",
    STATUS_STYLES[status],
    interactive && "cursor-pointer hover:opacity-80 transition-opacity active:scale-95"
  );

  return (
    <span
      className={base}
      onClick={onClick}
      title={STATUS_FULL[status]}
      role={interactive ? "button" : undefined}
    >
      {compact ? STATUS_LABELS[status] : STATUS_FULL[status]}
    </span>
  );
}
