import { createMetricSchema } from "@/src/types/api/zod-metric.schema";
import { UserMetricDetailResponseDTO } from "@/src/types/dtos/metric.dto";
import { z } from "zod";
import { ServerSortBy, SortOrder } from "./sort";

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

// * ========== Form
export const metricFormSchema = createMetricSchema.shape.body;
export type MetricFormInputs = z.infer<typeof metricFormSchema>;

// * ========== API Includes and Params
// MetricExtended Opts
export type IncludeKey = "settings" | "category" | "logs"; // For extended metric details
export type ListOptions = { enabled?: boolean; staleTime?: number };

export type MetricsListParams = {
  page?: number;
  limit?: number;
  sortBy?: ServerSortBy;
  sortOrder?: SortOrder;
  // optional filters you actually support on BE:
  q?: string;
  name?: string;
  categoryId?: string;
  isPublic?: boolean;
  // future: add more filters here as needed
};
