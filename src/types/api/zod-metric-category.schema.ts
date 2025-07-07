// src/types/api/zod-metric-category.schema.ts

import { z } from "zod";
import { ZodMessages } from "@/constants/zod-messages";
import {
  zMetricCategoryName,
  zMetricCategoryColor,
  zMetricCategoryIcon,
} from "@/validators/zod-rules";

/**
 * * Metric Category Schema Validator
 * Defines validation schemas for metric category-related requests.
 */

// CREATE MetricCategory Schema
export const createMetricCategorySchema = z.object({
  body: z.object({
    name: zMetricCategoryName,
    color: zMetricCategoryColor,
    icon: zMetricCategoryIcon,
  }),
});

// UPDATE MetricCategory Schema
export const updateMetricCategorySchema = z.object({
  params: z.object({
    id: z.string().uuid({ message: ZodMessages.metricCategory.invalidId }),
  }),
  body: z.object({
    name: zMetricCategoryName.optional(),
    color: zMetricCategoryColor.optional(),
    icon: zMetricCategoryIcon.optional(),
  }),
});

// GET MetricCategory Schema
export const getMetricCategorySchema = z.object({
  params: z.object({
    id: z.string().uuid({ message: ZodMessages.metricCategory.invalidId }),
  }),
});

// DELETE MetricCategory Schema
export const deleteMetricCategorySchema = z.object({
  params: z.object({
    id: z.string().uuid({ message: ZodMessages.metricCategory.invalidId }),
  }),
});

/**
 * * ===== Schemas for Testing Purposes =====
 */

export const generateDummyMetricCategoriesSchema = z.object({
  body: z.object({
    count: z.number().int().min(1).max(1000).default(50), // Default to 50, max 1000
  }),
});