// components/features/metrics/MetricLogAddModal.tsx

"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";

// Components
import Modal from "@/src/components/ui/Modal";
import PrimaryButton from "@/src/components/ui/PrimaryButton";

// Services
import { useCreateMetricLog } from "@/src/features/metricLogs/hooks";

// Types
import { LogFormInputs, logFormSchema } from "@/features/metricLogs/types";

// Props
interface MetricLogModalProps {
  open: boolean;
  onClose: () => void;
  metricId: string;
  defaultType?: "manual" | "automatic"; // Dev Note: Currently hardcoded to "manual" or "automatic", do not change
}

export const MetricLogFormModal: React.FC<MetricLogModalProps> = ({
  open,
  onClose,
  metricId,
  defaultType = "manual", //  Dev Note: Currently hardcoded, do not change
}) => {
  const queryClient = useQueryClient();

  // Form handler
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LogFormInputs>({
    resolver: zodResolver(logFormSchema),
    mode: "onChange",
    defaultValues: {
      metricId: metricId,
      type: defaultType,
      loggedAt: new Date(), // Set default to current date and time
    },
  });

  // Mutation setup with onSuccess to refetch logs and close modal
  const {
    createMetricLog,
    isError,
    error: mutationError,
  } = useCreateMetricLog(async () => {
    // Invalidate the logs query to refetch with fresh data
    queryClient.invalidateQueries({
      queryKey: ["metricLogs", metricId],
      exact: false,
    });
    reset();
    onClose();
  });

  // Mutation submtit handler
  const onSubmit = async (data: LogFormInputs) => {
    try {
      await createMetricLog({
        ...data,
        type: defaultType,
        metricId,
      });
    } catch (error) {
      console.error("Error creating metric log:", error);
    }
  };

  // When modal closes, always reset the form
  React.useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  if (!metricId) {
    return (
      <p className="mt-4 mb-4 text-red-500 text-xs">
        Metric ID is required to add a log.
      </p>
    );
  }

  return (
    <Modal isOpen={open} onClose={onClose}>
      <form
        className="w-full max-w-md bg-white p-6 rounded-2xl shadow"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <h2 className="text-xl font-bold mb-4">Add Log Entry</h2>

        {isError && (
          <p className="mt-4 mb-4 text-red-500 text-xs">
            {mutationError?.message || "Failed to add log. Please try again."}
          </p>
        )}

        {/* Hidden metricId field */}
        <input type="hidden" {...register("metricId")} value={metricId} />

        {/* Type Field */}
        {/* Dev Note: Currently Hardcoded - do not change */}
        {/* <div className="mb-4">
          <label className="block mb-1 text-sm font-semibold">
            Type
            <select
              className="w-full px-3 py-2 border rounded"
              {...register("type")}
            >
              <option value="manual">Manual</option>
              <option value="automatic">Automatic</option>
            </select>
          </label>
          {errors.type && (
            <p className="text-red-500 text-xs">{errors.type.message}</p>
          )}
        </div> */}

        {/* Value Field */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-semibold">
            Value
            <input
              type="number"
              step="any"
              min="0"
              className="w-full px-3 py-2 border rounded"
              {...register("logValue", { valueAsNumber: true })}
            />
          </label>
          {errors.logValue && (
            <p className="text-red-500 text-xs">{errors.logValue.message}</p>
          )}
        </div>

        {/* Logged At Field */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-semibold">
            Logged At
            <input
              type="datetime-local"
              className="w-full px-3 py-2 border rounded"
              {...register("loggedAt")}
            />
          </label>
          {errors.loggedAt && (
            <p className="text-red-500 text-xs">{errors.loggedAt.message}</p>
          )}
        </div>

        {!isValid && (
          <div>
            <p className="mt-4 mb-4 text-red-500 text-xs">
              All fields are required.
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-2 mt-6 justify-end">
          <button
            type="button"
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <PrimaryButton
            type="submit"
            disabled={isSubmitting || !isValid}
            className="min-w-[120px]"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
};

export default MetricLogFormModal;
