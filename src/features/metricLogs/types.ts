// src/features/metricLogs/types.ts

import { createMetricLogSchema } from "@/types/api/zod-metric-log.schema";
import { z } from "zod";

// Zod schema for the form body only (strip the params)
// TODO: Might better refactoring strategy

export const logFormSchema = createMetricLogSchema.shape.body;
export type LogFormInputs = z.infer<typeof logFormSchema>;
