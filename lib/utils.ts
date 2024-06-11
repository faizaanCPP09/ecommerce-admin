import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

//we have added formatter for product {currency}
export const formatter = new Intl.NumberFormat("en-IN",{
  style:'currency',
  currency:'INR'
})