// components/pages/metrics/MetricForm.tsx

"use client";

// libraries
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounce } from "react-use";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

// types
import { createMetricSchema } from "@/types/api/zod-metric.schema";
import { CreateMetricRequestDTO } from "@/src/types/dtos/metric.dto";

// components
import ReusableFormField from "@/components/ui/ReusableFormField";

// utils
import { createMetric } from "@/utils/interactors/metric.api";
import { handleApiError } from "@/utils/handleApiError";

// hooks
import useMetricsLibrary from "@/hooks/useMetricsLibrary";

// TODO 1: (Question) What's the best way to handle the form title and textfield value dynamically based on whether it's a create or update view based on the industry standard?
// TODO 1.1: Add dynamic form title based on create or update view
// TODO 1.2: Add dynamic textfield value if on update view

/**
 * MetricForm Component
 *
 * This component provides a form for creating new metrics.
 */
export default function MetricForm({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { metrics } = useMetricsLibrary(1, 20);
  const [debouncedName, setDebouncedName] = useState("");
  const [debouncedDefaultUnit, setDebouncedDefaultUnit] = useState("");

  // React Hook Form with Zod Validation
  /**
   * TODO: Create a handcrafter method for this instead of consuming the DTO directly
   * Why? To ensure this form able to be used for Create and Update (which update required params)
   */
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CreateMetricRequestDTO>({
    resolver: zodResolver(createMetricSchema.shape.body),
    mode: "onChange",
  });

  // Debounce the name input to prevent excessive API calls
  const [cancelName] = useDebounce(
    () => {
      console.log("Debounced name:", debouncedName);
    },
    500,
    [debouncedName]
  );

  cancelName();

  // Debounce the defaultUnit input to prevent excessive API calls
  const [cancelDefaultUnit] = useDebounce(
    () => {
      console.log("Debounced defaultUnit:", debouncedDefaultUnit);
    },
    500,
    [debouncedDefaultUnit]
  );

  cancelDefaultUnit();

  // UseMutation for API request
  const { mutateAsync, error: mutationError } = useMutation({
    mutationFn: createMetric,
    /**
     * onSuccess callback for the useMutation hook.
     * Invalidates the 'metrics' query and closes the modal.
     */
    onSuccess: () => {
      console.log("Mutation succeeded");
      queryClient.invalidateQueries({ queryKey: ["metrics"] });
      onClose();
    },
    /**
     * onError callback for the useMutation hook.
     * Logs the error and sets isSubmitting to false.
     * @param {unknown} error - The error object.
     */
    onError: (error: unknown) => {
      const errorMessages = handleApiError(error as Error);
      console.error("Mutation error:", errorMessages);
      setIsSubmitting(false);
    },
  });

  /**
   * Form Submit Handler
   * @param {z.infer<typeof createMetricSchema>["body"]} data - The form data.
   */
  const onSubmit = async (data: z.infer<typeof createMetricSchema>["body"]) => {
    if (!isValid) {
      console.log("Form is not valid, preventing submission.");
      return;
    }

    console.log("onSubmit called with data:", data);
    setIsSubmitting(true);

    // Note: We are setting the `isPublic` to `true` by default
    // Public profile will be implemented in a future release
    const finalData: CreateMetricRequestDTO = {
      ...data,
      isPublic: true,
    };

    try {
      console.log("Submitting metric data:", finalData);
      await mutateAsync(finalData);
      console.log("mutateAsync completed successfully");
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Inline Error Message for API Errors
  // This will be displayed if the API call fails
  const safeErrorMessage = useMemo(() => {
    if (!mutationError) return null;
    return (
      handleApiError(mutationError as Error)[0] ||
      "An unexpected error occurred."
    );
  }, [mutationError]);

  return (
    <div className="bg-white p-6 max-w-lg min-w-96 mx-auto">
      <h2 className="text-xl font-semibold mb-4">Manage Metric</h2>

      {safeErrorMessage && (
        <div className="text-red-500 mb-4">
          Error creating metric: {safeErrorMessage}
        </div>
      )}

      <form
        className="space-y-8"
        onSubmit={handleSubmit((data) => {
          if (Object.keys(errors).length > 0) {
            console.log("Form has errors, preventing submission.");
            return;
          }
          onSubmit(data);
        })}
      >
        <ReusableFormField
          label="Metric Name"
          type="text"
          register={register("name", {
            onChange: (e) => {
              setDebouncedName(e.target.value);
            },
            validate: {
              /**
               * Validates if the metric name is unique.
               * @param {string} value - The metric name.
               * @returns {string | boolean} - An error message if the name is not unique, true otherwise.
               */
              isUnique: (value: string) => {
                if (metrics.map((metric) => metric.name).includes(value)) {
                  return "Metric name already exists";
                }
                return true;
              },
            },
          })}
          placeholder="e.g., Steps Walked"
          error={errors.name?.message}
          isSubmitting={isSubmitting}
        />

        <ReusableFormField
          label="Description"
          type="text"
          register={register("description")}
          placeholder="Optional description"
          isSubmitting={isSubmitting}
        />

        <ReusableFormField
          label="Default Unit"
          type="text"
          register={register("defaultUnit", {
            onChange: (e) => {
              setDebouncedDefaultUnit(e.target.value);
            },
          })}
          placeholder="e.g., km, reps, hours"
          error={errors.defaultUnit?.message}
          isSubmitting={isSubmitting}
        />

        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition w-full disabled:bg-gray-400"
        >
          {isSubmitting ? "Saving..." : "Save Metric"}
        </button>
      </form>
    </div>
  );
}
