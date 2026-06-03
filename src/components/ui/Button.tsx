import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import type { LucideIcon } from "lucide-react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  loading?: boolean;
}

const variants = {
  primary: "bg-[#cc6600] hover:bg-[#e07000] text-white shadow-lg shadow-[#cc6600]/20",
  secondary: "bg-[#1a1a1a] hover:bg-[#222] text-white border border-[#2a2a2a]",
  ghost: "hover:bg-white/5 text-[#aaa] hover:text-white",
  danger: "bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-900/50",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2.5 text-sm gap-2",
  lg: "px-5 py-3 text-base gap-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", icon: Icon, loading, children, className, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#cc6600] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 size={size === "sm" ? 14 : 16} className="animate-spin" />
        ) : Icon ? (
          <Icon size={size === "sm" ? 14 : 16} />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
