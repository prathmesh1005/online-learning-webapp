import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  try {
    // Filter out undefined, null, or invalid inputs
    const validInputs = inputs.filter(input => input != null);
    return twMerge(clsx(validInputs));
  } catch (error) {
    console.error('Error in cn function:', error);
    // Return a fallback class if there's an error
    return '';
  }
}
