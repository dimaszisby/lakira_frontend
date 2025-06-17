import { parseISO, format } from "date-fns";

/**
 * Checks if the provided date is valid.
 * @param date - The date to validate, can be a string or Date object.
 * @returns True if the date is valid, false otherwise.
 */
export const isValidDate = (date: unknown) => {
  if (!date) return false;
  const d = typeof date === "string" ? parseISO(date) : date;
  return d instanceof Date && !isNaN(d.getTime());
};

/**
 * Formats a date into a human-readable string.
 * @param date - The date to format, can be a string or Date object.
 * @param withTime - If true, includes time in the format.
 * @returns A formatted date string or "-" if the date is invalid.
 */
export const formatDate = (date?: string | Date | null, withTime = false) => {
  if (!date) return "-";
  const d = typeof date === "string" ? parseISO(date) : date;
  if (!(d instanceof Date) || isNaN(d.getTime())) return "-";
  return withTime ? format(d, "d MMMM yyyy HH:mm") : format(d, "d MMM yyyy");
};
