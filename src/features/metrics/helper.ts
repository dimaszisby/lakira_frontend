// src/features/metrics/helper.ts

import { UserMetricDetailResponseDTO } from "@/src/types/dtos/metric.dto";
import { MetricCore } from "./types";

export const extractMetricCore = (
  metricDetail: UserMetricDetailResponseDTO
): MetricCore => {
  // Could use lodash.pick or do it manually:
  const {
    id,
    userId,
    categoryId,
    originalMetricId,
    name,
    description,
    defaultUnit,
    isPublic,
    createdAt,
    updatedAt,
  } = metricDetail;
  return {
    id,
    userId,
    categoryId,
    originalMetricId,
    name,
    description,
    defaultUnit,
    isPublic,
    createdAt,
    updatedAt,
  };
};
