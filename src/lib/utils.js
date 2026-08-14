import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merge Tailwind classes safely — drops conflicting utilities.
 * Compatible with shadcn/ui conventions.
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs))
}
