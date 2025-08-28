import { createMetricLogSchema } from "@/types/api/zod-metric-log.schema";
import { z } from "zod";

// * Form Schema
export const logFormSchema = createMetricLogSchema.shape.body;
export type LogFormInputs = z.infer<typeof logFormSchema>;
