import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-md border border-border bg-[#101010] px-3 text-sm text-white outline-none transition placeholder:text-muted focus:border-gold",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full rounded-md border border-border bg-[#101010] px-3 py-2 text-sm text-white outline-none transition placeholder:text-muted focus:border-gold",
        className,
      )}
      {...props}
    />
  );
}

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-11 w-full rounded-md border border-border bg-[#101010] px-3 text-sm text-white outline-none transition focus:border-gold",
        className,
      )}
      {...props}
    />
  );
}
