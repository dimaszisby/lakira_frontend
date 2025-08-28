"use client";

// WIP Metric Form

import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounce } from "react-use";
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
import ErrorMessage from "../../ui/ErrorMessage";
import CategorySelect from "../../ui/CategorySelect";
import { MetricFormInitial } from "@/src/features/metrics/form.initial";
import { TextField } from "../../ui/TextField";
import { TextAreaField } from "../../ui/TextArea";

interface MetricModalProps {
  open: boolean;
  onClose: () => void;
  metricId: string | null;
  initialMetric?: MetricFormInitial | null;
}

export const MetricForm = ({
  open,
  onClose,
  metricId,
  initialMetric,
}: MetricModalProps) => {
  // Default Form handling
  const makeDefaults = (m?: MetricFormInitial | null): MetricFormInputs => ({
    categoryId: m?.categoryId ?? undefined,
    originalMetricId: m?.originalMetricId ?? undefined,
    name: m?.name ?? "",
    description: m?.description ?? "",
    defaultUnit: m?.defaultUnit ?? "",
    isPublic: m?.isPublic ?? false,
  });

  const isEditMode = !!initialMetric;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
    setError,
    clearErrors,
    watch,
    control,
  } = useForm<MetricFormInputs>({
    resolver: zodResolver(metricFormSchema),
    mode: "onChange",
    defaultValues: makeDefaults(initialMetric),
  });

  // Rehydrate -> open/change with a stable key
  const formKey = open ? initialMetric?.id ?? "create" : "closed";
  const prevKeyRef = useRef<string | null>(null);
  useEffect(() => {
    if (!open) return;
    // only run when switching between "create" and a specific metric (or between metrics)
    if (prevKeyRef.current === formKey) return;

    reset(makeDefaults(initialMetric));
    prevKeyRef.current = formKey;
  }, [initialMetric, open, formKey, reset]);

  // Build unique ids per field (prevents collisions if multiple forms render)
  const fieldId = (name: string) => `metric-${formKey}-${name}`;

  // * ========== Duplicate Name Check ==========

  // Debounce the name input to prevent excessive API calls
  const nameValue = watch("name") ?? "";
  const [debouncedName, setDebouncedName] = useState(nameValue);
  useDebounce(() => setDebouncedName(nameValue.trim()), 400, [nameValue]);

  const duplicateCheckParams = useMemo(
    () => ({
      page: 1,
      limit: 1,
      name: debouncedName || undefined,
    }),
    [debouncedName]
  );

  // Only fetch when modal is open and user typed 2+ chars
  const shouldCheckDup = open && debouncedName.length >= 2;
  const { metrics: dupCandidates = [] } = useMetricsLibrary(
    duplicateCheckParams,
    {
      enabled: shouldCheckDup,
      staleTime: 5_000,
    }
  );

  // derive current “has conflict” + current error state
  const hasValidateError = !!errors.name && errors.name.type === "validate";
  // Reconcile dup result with current mode (ignore same record on edit)
  useEffect(() => {
    if (!shouldCheckDup) {
      if (hasValidateError) clearErrors("name");
      return;
    }
    const conflict = dupCandidates.some(
      (m) =>
        m.name.trim().toLowerCase() === debouncedName.toLowerCase() &&
        (!isEditMode || m.id !== initialMetric?.id)
    );
    if (conflict && !hasValidateError) {
      setError("name", {
        type: "validate",
        message: "Metric name already exists",
      });
    } else if (!conflict && hasValidateError) {
      clearErrors("name");
    }
  }, [
    shouldCheckDup,
    dupCandidates,
    debouncedName,
    isEditMode,
    initialMetric?.id,
    hasValidateError,
    setError,
    clearErrors,
  ]);

  // * ========== Mutations ==========
  const {
    createMetric,
    isPending: isCreating,
    error: createError,
  } = useCreateMetric();

  const {
    updateMetric,
    isPending: isUpdating,
    error: updateError,
  } = useUpdateMetric();

  const {
    deleteMetric,
    isPending: isDeleting,
    error: deleteError,
  } = useDeleteMetric();

  const isBusyInputs = isSubmitting || isCreating || isUpdating;

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
    if (!metricId) return;
    try {
      await deleteMetric(metricId);
      reset();
      onClose();
    } catch (error) {
      console.error("Error deleting metric log:", error);
    }
  };

  const errorMsg =
    createError?.message || updateError?.message || deleteError?.message || "";

  return (
    <Modal isOpen={open} onClose={onClose}>
      <form
        className="flex flex-col bg-white p-2 sm:p-2 lg:p-6 max-w-lg min-w-96 mx-auto"
        onSubmit={handleSubmit((data) => {
          if (Object.keys(errors).length > 0) {
            console.log("Form has errors, preventing submission.");
            return;
          }
          onSubmit(data);
        })}
      >
        <h2 className="text-xl font-semibold mb-2">Manage Metric</h2>

        <ErrorMessage message={errorMsg} className="mb-2"></ErrorMessage>

        <div className="flex flex-col gap-8">
          <TextField
            id={fieldId("name")}
            label="Metric Name"
            registration={register("name")}
            placeholder="e.g., Steps Walked"
            error={errors.name?.message}
            disabled={isBusyInputs}
            required
          />

          <TextField
            id={fieldId("defaultUnit")}
            label="Default Unit"
            registration={register("defaultUnit")}
            placeholder="e.g., km, reps, hours"
            error={errors.defaultUnit?.message}
            disabled={isBusyInputs}
            required
          />

          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <CategorySelect
                value={field.value}
                onChange={field.onChange}
                selectedOptionHint={initialMetric?.categoryHint}
              />
            )}
          />

          {/* Should be a TextArea */}
          <TextAreaField
            id={fieldId("description")}
            label="Description"
            registration={register("description")}
            placeholder="i.e., Metric to calculate muscle growth over time"
            error={errors.description?.message}
            disabled={isBusyInputs}
            rows={5}
          />
        </div>

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
