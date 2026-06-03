import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as INR currency */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Format an ISO date string to a human-readable date */
export function formatDate(iso: string): string {
  return format(parseISO(iso), "dd MMM yyyy");
}

/** Get the number of days in a given month/year */
export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/** Zero-pad a number to 2 digits */
export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** Build ISO date string from year, month (1-based), day */
export function toISODate(year: number, month: number, day: number): string {
  return `${year}-${pad2(month)}-${pad2(day)}`;
}
