import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" && "bg-gold text-black hover:bg-gold-soft",
        variant === "secondary" && "border border-border bg-panel-2 text-white hover:border-gold/70",
        variant === "ghost" && "text-muted hover:bg-panel-2 hover:text-white",
        variant === "danger" && "bg-red-500 text-white hover:bg-red-400",
        className,
      )}
      {...props}
    />
  );
}
