// components/pages/metrics/MetricForm.tsx

"use client";

// libraries
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounce } from "react-use";
import { useQueryClient } from "@tanstack/react-query";

// types
import { MetricResponseDTO } from "@/src/types/dtos/metric.dto";

// components
import ReusableFormField from "@/src/components/ui/ReusableFormField";

// hooks
import {
  useCreateMetric,
  useDeleteMetric,
  useMetricsLibrary,
  useUpdateMetric,
} from "@/src/features/metrics/hooks";
import {
  MetricFormInputs,
  metricFormSchema,
} from "@/src/features/metrics/types";
import PrimaryButton from "../../ui/PrimaryButton";
import Modal from "../../ui/Modal";

// TODO 1: (Question) What's the best way to handle the form title and textfield value dynamically based on whether it's a create or update view based on the industry standard?
// TODO 1.1: Add dynamic form title based on create or update view
// TODO 1.2: Add dynamic textfield value if on update view

interface MetricModalProps {
  open: boolean;
  onClose: () => void;
  metricId: string | null;
  initialMetric?: MetricResponseDTO | null;
}

/**
 * MetricForm Component
 *
 * This component provides a form for creating new metrics.
 */
export const MetricForm: React.FC<MetricModalProps> = ({
  open,
  onClose,
  metricId,
  initialMetric,
}) => {
  const isEditMode = !!initialMetric;
  const queryClient = useQueryClient();

  // const [isSubmitting, setIsSubmitting] = useState(false);

  // To check if metric already exists to prevent dupplications
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
    reset,
    formState: { errors, isSubmitting, isValid },
    setValue,
  } = useForm<MetricFormInputs>({
    resolver: zodResolver(metricFormSchema),
    mode: "onChange",
    defaultValues: isEditMode
      ? {
          categoryId: initialMetric?.categoryId ?? undefined,
          originalMetricId: initialMetric?.originalMetricId ?? undefined,
          name: initialMetric?.name ?? "",
          description: initialMetric?.description ?? "",
          defaultUnit: initialMetric?.defaultUnit ?? "",
          isPublic: initialMetric?.isPublic ?? false,
        }
      : {
          categoryId: undefined,
          originalMetricId: undefined,
          name: "",
          description: "",
          defaultUnit: "",
          isPublic: false,
        },
  });

  useEffect(() => {
    if (open && isEditMode && initialMetric) {
      setValue("categoryId", initialMetric.categoryId ?? undefined);
      setValue("originalMetricId", initialMetric.originalMetricId ?? undefined);
      setValue("name", initialMetric.name ?? "");
      setValue("description", initialMetric.description ?? "");
      setValue("defaultUnit", initialMetric.defaultUnit ?? "");
      setValue("isPublic", initialMetric.isPublic ?? false);
    }
  }, [open, isEditMode, initialMetric, metricId, setValue, reset]);

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

  // * Mutation Hooks
  const {
    createMetric,
    isPending: isCreating,
    error: createError,
  } = useCreateMetric(async () => {
    queryClient.invalidateQueries({ queryKey: ["metrics", metricId] });
  });

  const {
    updateMetric,
    isPending: isUpdating,
    error: updateError,
  } = useUpdateMetric(async () => {
    queryClient.invalidateQueries({ queryKey: ["metrics", metricId] });
  });

  const {
    deleteMetric,
    isPending: isDeleting,
    error: deleteError,
  } = useDeleteMetric(async () => {
    queryClient.invalidateQueries({ queryKey: ["metrics", metricId] });
  });

  // * Submit Handlers
  const onSubmit = async (data: MetricFormInputs) => {
    if (!isValid) {
      console.log("Form is not valid, preventing submission.");
      return;
    }

    try {
      if (isEditMode && initialMetric && metricId) {
        await updateMetric({ metricId: metricId, metric: data });
      } else {
        await createMetric(data);
      }
      reset();
      onClose();
    } catch (error) {
      console.error("Error creating metric log:", error);
    }
  };

  const onDeleteSubmit = async () => {
    if (!initialMetric) return;
    try {
      await deleteMetric(initialMetric.id);
      reset();
      onClose();
    } catch (error) {
      console.error("Error deleting metric log:", error);
    }
  };

  // Inline Error Message for API Errors
  // This will be displayed if the API call fails
  // const safeErrorMessage = useMemo(() => {
  //   if (!mutationError) return null;
  //   return (
  //     handleApiError(mutationError as Error)[0] ||
  //     "An unexpected error occurred."
  //   );
  // }, [mutationError]);

  const errorMsg =
    createError?.message || updateError?.message || deleteError?.message || "";

  return (
    <Modal isOpen={open} onClose={onClose}>
      <form
        className="bg-white p-6 max-w-lg min-w-96 mx-auto space-y-8"
        onSubmit={handleSubmit((data) => {
          if (Object.keys(errors).length > 0) {
            console.log("Form has errors, preventing submission.");
            return;
          }
          onSubmit(data);
        })}
      >
        <h2 className="text-xl font-semibold mb-4">Manage Metric</h2>

        {/* Error Message */}
        <div className="inline-block h-2 mb-4">
          {errorMsg && <p className="text-red-500 text-xs mb-2">{errorMsg}</p>}
        </div>
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
          isSubmitting={isSubmitting || isCreating || isUpdating}
        />

        <ReusableFormField
          label="Description"
          type="text"
          register={register("description")}
          placeholder="Optional description"
          isSubmitting={isSubmitting || isCreating || isUpdating}
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
          isSubmitting={isSubmitting || isCreating || isUpdating}
        />

        {/* Buttons */}
        <div className="flex-row space-y-4">
          <div className="flex gap-2 mt-6 justify-center items">
            <button
              type="button"
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 w-full"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <PrimaryButton
              type="submit"
              disabled={isSubmitting || !isValid}
              className="w-full"
            >
              {isSubmitting || isCreating || isUpdating
                ? "Saving..."
                : isEditMode
                ? "Save"
                : "Add"}
            </PrimaryButton>
          </div>

          {/* Delete button (edit mode only) */}
          {isEditMode && (
            <>
              <hr
                style={{ borderTop: "1px solid lightgrey" }}
                className="my-4"
              />
              <button
                type="button"
                className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 w-full"
                onClick={onDeleteSubmit}
                disabled={isSubmitting || isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Log"}
              </button>
            </>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default MetricForm;
