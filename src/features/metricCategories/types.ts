import { createMetricCategorySchema } from "@/src/types/api/zod-metric-category.schema";
import { z } from "zod";

// * Schema
export const metricCategoryFormSchema = createMetricCategorySchema.shape.body;
export type MetricCategoryFormInput = z.infer<typeof metricCategoryFormSchema>;
