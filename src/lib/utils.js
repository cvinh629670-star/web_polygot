import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Gộp lớp CSS có điều kiện và xử lý các tiện ích Tailwind bị trùng.
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
