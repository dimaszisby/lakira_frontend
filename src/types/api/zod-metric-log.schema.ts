// src/types/api/zod-metric-log.schema.ts

// Developer Note: This code is part of a Zod schema definition for metric logs in a TypeScript application.
// It defines the structure and validation rules for creating, updating, retrieving, and deleting metric logs.
// The schemas are used to ensure that the data sent to and received from the API adheres to the expected format.
// It also includes a schema for generating dummy metric logs for testing purposes.

// Developer Note: This schema reflects current API endpoints and their expected request/response structures.

import {
  zDateOptional,
  zLogType,
  zPositiveFloat,
  zUUID,
} from "@/src/constants/zod-rules";
import { z } from "zod";

export const createMetricLogSchema = z.object({
  body: z.object({
    metricId: zUUID,
    type: zLogType.optional().default("manual"),
    logValue: zPositiveFloat,
    loggedAt: zDateOptional,
  }),
});

export const updateMetricLogSchema = z.object({
  params: z.object({
    id: zUUID,
  }),
  body: z.object({
    type: zLogType.optional(),
    logValue: zPositiveFloat.optional(),
    loggedAt: zDateOptional,
  }),
});

export const getMetricLogSchema = z.object({
  params: z.object({
    id: zUUID,
  }),
});

export const getAllMetricLogsSchema = z.object({
  query: z
    .object({
      metricId: zUUID.optional(),
      startDate: zDateOptional,
      endDate: zDateOptional,
      sortBy: z.string().optional(),
      order: z.enum(["asc", "desc"]).optional(),
      page: z.preprocess(Number, z.number().int().min(1)).optional().default(1),
      limit: z
        .preprocess(Number, z.number().int().min(1))
        .optional()
        .default(10),
    })
    .optional(),
});

export const deleteMetricLogSchema = z.object({
  params: z.object({
    id: zUUID,
  }),
});

export const getAggregatedStatsSchema = z.object({
  query: z.object({
    metricId: zUUID.optional(),
  }),
});

/**
 * * ===== Schemas for Testing Purposes =====
 */

export const generateDummyMetricLogsSchema = z.object({
  body: z.object({
    metricId: zUUID,
    count: z.number().int().min(1).max(1000).default(50), // Default to 50, max 1000 to prevent abuse
  }),
});
