import { format, parseISO } from "date-fns";
import { CURRENCY } from "./constants";

/**
 * Formats minor units (kobo) to currency string with proper symbols and commas
 * @param amountInMinorUnits Amount in kobo (integer)
 * @param includeSymbol Whether to include the currency symbol
 */
export function formatMoney(
  amountInMinorUnits: number,
  includeSymbol: boolean = true
): string {
  const majorUnits = amountInMinorUnits / CURRENCY.minorUnitRatio;

  const formatter = new Intl.NumberFormat(CURRENCY.locale, {
    style: includeSymbol ? "currency" : "decimal",
    currency: CURRENCY.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return formatter.format(majorUnits);
}

/**
 * Formats price in kobo with unit label e.g. "₦9,500 / bag" or "₦120,000 / trip"
 */
export function formatPriceWithUnit(
  amountInMinorUnits: number,
  unit?: string,
  includeSymbol: boolean = true
): string {
  const priceFormatted = formatMoney(amountInMinorUnits, includeSymbol);
  if (!unit) return priceFormatted;
  return `${priceFormatted} / ${unit}`;
}

/**
 * Formats an ISO date string or Date object into human-readable format
 */
export function formatDate(date: string | Date, formatStr: string = "MMM d, yyyy, h:mm a"): string {
  const parsedDate = typeof date === "string" ? parseISO(date) : date;
  return format(parsedDate, formatStr);
}

/**
 * Generates human-friendly order number e.g. BM-20261003-4821
 */
export function generateOrderNumber(date: Date = new Date()): string {
  const yyyy = date.getFullYear().toString();
  const mm = (date.getMonth() + 1).toString().padStart(2, "0");
  const dd = date.getDate().toString().padStart(2, "0");
  const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
  return `BM-${yyyy}${mm}${dd}-${randomSuffix}`;
}
