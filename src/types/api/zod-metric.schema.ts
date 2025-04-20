import { z } from "zod";
import {
  zUUID,
  zMetricName,
  zMetricCategoryId,
  zMetricDescription,
  zMetricDefaultUnit,
  zMetricIsPublic,
  zMetricOriginalId,
} from "@/validators/zod-rules";

export const createMetricSchema = z.object({
  body: z.object({
    categoryId: zMetricCategoryId.optional(),
    originalMetricId: zMetricOriginalId.optional(),
    name: zMetricName,
    description: zMetricDescription.optional(),
    defaultUnit: zMetricDefaultUnit,
    isPublic: zMetricIsPublic,
    // deletedAt should likely not be part of create/update via API
    // deletedAt: zMetricDeletedAt,
  }),
});

export const updateMetricSchema = z.object({
  params: z.object({
    id: zUUID,
  }),
  // Make all fields optional for update
  body: z.object({
    categoryId: zMetricCategoryId.optional(),
    originalMetricId: zMetricOriginalId.optional(),
    name: zMetricName.optional(),
    description: zMetricDescription.optional(),
    defaultUnit: zMetricDefaultUnit.optional(),
    isPublic: zMetricIsPublic.optional(),
    // deletedAt should likely not be part of create/update via API
    // deletedAt: zMetricDeletedAt.optional(),
  }),
});

export const getMetricSchema = z.object({
  params: z.object({
    id: zUUID,
  }),
});

export const deleteMetricSchema = getMetricSchema;

// TODO: Uncomment and implement these schemas as needed (Need to update backend API)
// export const getAllMetricsSchema = z.object({
//   query: z.object({
//     categoryId: z.string().optional(),
//     isPublic: z.boolean().optional(),
//     search: z.string().optional(),
//   }),
// });
// export const getMetricByOriginalIdSchema = z.object({
//   params: z.object({
//     originalId: z.string(),
//   }),
// });
// export const getMetricsByCategoryIdSchema = z.object({
//   params: z.object({
//     categoryId: z.string(),
//   }),
//   query: z.object({
//     isPublic: z.boolean().optional(),
//     search: z.string().optional(),
//   }),
// });