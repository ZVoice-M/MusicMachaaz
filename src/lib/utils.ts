import { clsx, type ClassValue } from "clsx";
import { format, parseISO } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function currency(amount: number | null | undefined, code = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: code,
    maximumFractionDigits: 0,
  }).format(Number(amount ?? 0));
}

export function formatDate(value?: string | null) {
  if (!value) return "-";
  return format(parseISO(value), "dd MMM yyyy");
}

export function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function toDateInput(date = new Date()) {
  return format(date, "yyyy-MM-dd");
}
