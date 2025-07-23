// src/features/metrics/types.ts

import { createMetricSchema } from "@/src/types/api/zod-metric.schema";
import { UserMetricDetailResponseDTO } from "@/src/types/dtos/metric.dto";
import { z } from "zod";

// Pick only core properties
export type MetricCore = Pick<
  UserMetricDetailResponseDTO,
  | "id"
  | "userId"
  | "categoryId"
  | "originalMetricId"
  | "name"
  | "description"
  | "defaultUnit"
  | "isPublic"
  | "createdAt"
  | "updatedAt"
>;

// * Form Inputs
export const metricFormSchema = createMetricSchema.shape.body;
export type MetricFormInputs = z.infer<typeof metricFormSchema>;
