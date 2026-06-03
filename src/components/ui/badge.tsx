import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "green" | "red" | "yellow" | "blue";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        tone === "default" && "border-border bg-panel-2 text-muted",
        tone === "green" && "border-green-400/30 bg-green-400/10 text-green-300",
        tone === "red" && "border-red-400/30 bg-red-400/10 text-red-300",
        tone === "yellow" && "border-yellow-300/30 bg-yellow-300/10 text-yellow-200",
        tone === "blue" && "border-blue-300/30 bg-blue-300/10 text-blue-200",
      )}
    >
      {children}
    </span>
  );
}
