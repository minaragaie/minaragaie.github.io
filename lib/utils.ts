import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// utils/slugify.ts
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")   // collapse groups of non-alphanumeric into one dash
    .replace(/^-+|-+$/g, "");      // trim leading/trailing dashes
}
