// src/validators/zod-rules.ts
import { z } from "zod";
import { ZodMessages } from "@/constants/zod-messages"; // centralized error messages

/**
 * Reusable Zod Field Validations
 * - These base validators can be composed into full schemas
 */

// Reuse base rules
export const zUUID = z
  .string()
  .uuid({ message: ZodMessages.common.invalidUUID });
export const zDateOptional = z
  .preprocess(
    (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
    z.coerce.date().optional()
  )
  .refine((date) => date === undefined || !isNaN(date.getTime()), {
    message: ZodMessages.common.invalidDate,
  });

/**
 * export const zMetricCategoryId = zUUID.optional().nullable();
 */
export const zUsername = z
  .string()
  .min(3, { message: ZodMessages.user.usernameMin });
export const zEmail = z
  .string()
  .email({ message: ZodMessages.user.emailInvalid });
export const zPassword = z
  .string()
  .min(6, { message: ZodMessages.user.passwordMin });
export const zPasswordConfirmation = z
  .string()
  .min(6, { message: ZodMessages.user.passwordConfirmMin });
export const zPublicProfile = z.boolean().optional().default(true);
export const zRole = z.enum(["user", "admin"]).optional().default("user");

/**
 * * Metric Category
 */
export const zMetricCategoryName = z
  .string()
  .min(1, { message: ZodMessages.metricCategory.nameRequired });
export const zMetricCategoryColor = z
  .string()
  .min(1)
  .optional()
  .default("#E897A3");
export const zMetricCategoryIcon = z.string().min(1).optional().default("📁");
export const zMetricCategoryDeletedAt = zDateOptional.optional().nullable();

/**
 * * Metric
 */
export const zMetricNameRule = {
  min: 1,
};

export const zMetricUnitRule = {
  min: 1,
};
export const zMetricName = z
  .string()
  .min(zMetricNameRule.min, { message: ZodMessages.metric.nameRequired });
export const zMetricCategoryId = z
  .string()
  .uuid({ message: ZodMessages.metric.invalidCategoryId })
  .optional();
export const zMetricOriginalId = z
  .string()
  .uuid({ message: ZodMessages.metric.invalidOriginalMetricId })
  .optional();
export const zMetricDescription = z.string().optional().nullable();
export const zMetricDefaultUnit = z
  .string()
  .min(zMetricUnitRule.min, { message: ZodMessages.metric.unitRequired });
export const zMetricIsPublic = z.boolean().optional().default(true);
export const zMetricDeletedAt = zDateOptional.optional().nullable();

/**
 * * Metric Settings
 */
export const zGoalEnabled = z.boolean().optional().default(false);
export const zGoalType = z
  .enum(["cumulative", "incremental"])
  .optional()
  .nullable();
export const zGoalValue = z
  .number()
  .positive(ZodMessages.metricSettings.goalValuePositive)
  .optional()
  .nullable();
export const zTimeFrameEnabled = z.boolean().optional().default(false);
export const zStartDate = zDateOptional.optional().nullable();
export const zDeadlineDate = zDateOptional.optional().nullable();
export const zAlertEnabled = z.boolean().optional().default(false);
export const zAlertThresholds = z
  .number()
  .int({ message: ZodMessages.metricSettings.invalidAlertThreshold })
  .min(0, { message: ZodMessages.metricSettings.alertThresholdMin })
  .max(100, { message: ZodMessages.metricSettings.alertThresholdMax })
  .optional()
  .default(80);
export const zDisplayOptions = z
  .object({
    showOnDashboard: z.boolean().optional().default(true),
    priority: z.number().optional().nullable(),
    chartType: z.string().optional().nullable(),
    color: z.string().optional().nullable(),
  })
  .optional()
  .default({
    showOnDashboard: true,
    priority: null,
    chartType: null,
    color: null,
  });

/**
 * * * Metric Log
 */
export const zPositiveFloat = z
  .number({ required_error: ZodMessages.metricLog.logValueRequired })
  .positive({ message: ZodMessages.metricLog.logValueNonNegative });

export const zLogType = z.enum(["manual", "automatic"], {
  required_error: ZodMessages.metricLog.logTypeInvalid,
});