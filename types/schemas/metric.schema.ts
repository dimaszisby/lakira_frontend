import { z } from "zod";

/**
 * Validation schema for metric creation.
 * Ensures required fields are correctly formatted.
 */
export const MetricSchema = z.object({
  name: z.string().min(3, "Metric name must be at least 3 characters"),
  description: z.string().optional(),
  default_unit: z.string().min(1, "Default unit is required"),
});

/** Infer form validation type from Zod schema */
export type MetricFormType = z.infer<typeof MetricSchema>;
