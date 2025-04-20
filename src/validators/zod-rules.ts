import { z } from "zod";

export const zMetricCategoryName = z
  .string()
  .min(3, { message: "Metric category name must be at least 3 characters" })
  .max(50, { message: "Metric category name must be at most 50 characters" });

export const zMetricCategoryColor = z
  .string()
  .regex(/^#([0-9A-Fa-f]{3}){1,2}$/, {
    message: "Invalid color code",
  });

export const zMetricCategoryIcon = z.string();

// Generic UUID validator
export const zUUID = z.string().uuid({ message: "Invalid UUID" });

// Generic log type validator
export const zLogType = z.enum(["manual", "automatic"]);

// Generic positive float validator
export const zPositiveFloat = z.number().positive({ message: "Value must be positive" });

// Generic optional date validator
export const zDateOptional = z.date().optional();

// Generic goal value validator
export const zGoalValue = z.number().positive({ message: "Goal value must be positive" });

// Generic goal type validator
export const zGoalType = z.enum(["cumulative", "incremental"]);

// Generic alert thresholds validator
export const zAlertThresholds = z.number().min(0).max(100);

// Generic display options validator
export const zDisplayOptions = z.object({
  showOnDashboard: z.boolean().optional(),
  priority: z.number().optional(),
  chartType: z.string().optional(),
  color: z.string().optional(),
});

// Metric name validator
export const zMetricName = z
  .string()
  .min(3, { message: "Metric name must be at least 3 characters" })
  .max(50, { message: "Metric name must be at most 50 characters" });

// Metric category ID validator
export const zMetricCategoryId = zUUID.optional();

// Metric description validator
export const zMetricDescription = z.string().max(255, { message: "Metric description must be at most 255 characters" }).optional();

// Metric default unit validator
export const zMetricDefaultUnit = z.string();

// Metric isPublic validator
export const zMetricIsPublic = z.boolean().default(true);

// Metric original ID validator
export const zMetricOriginalId = zUUID.optional();

// Metric deletedAt validator
export const zMetricDeletedAt = z.date().optional().nullable();

// Username validator
export const zUsername = z
  .string()
  .min(3, { message: "Username must be at least 3 characters" })
  .max(50, { message: "Username must be at most 50 characters" });

// Email validator
export const zEmail = z.string().email({ message: "Invalid email address" });

// Password validator
export const zPassword = z
  .string()
  .min(6, { message: "Password must be at least 6 characters" });

// Password confirmation validator
export const zPasswordConfirmation = z
  .string()
  .min(6, { message: "Password confirmation must be at least 6 characters" });

// Public profile validator
export const zPublicProfile = z.boolean().optional().default(true);

// Role validator
export const zRole = z.enum(["user", "admin"]).optional().default("user");