import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function splitFullName(fullName?: string | null) {
  if (!fullName?.trim()) {
    return { firstName: "", lastName: "" };
  }

  const parts = fullName.trim().split(/\s+/);

  return {
    firstName: parts[0] ?? "",
    lastName: parts.slice(1).join(" "),
  };
}

export function getFirstName(fullName?: string | null) {
  return splitFullName(fullName).firstName || "there";
}
