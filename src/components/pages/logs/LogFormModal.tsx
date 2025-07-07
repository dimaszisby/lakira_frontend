// components/features/metrics/MetricLogAddModal.tsx

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Components
import Modal from "@/src/components/ui/Modal";
import PrimaryButton from "@/src/components/ui/PrimaryButton";

// Types
import { createMetricLogSchema } from "@/types/api/zod-metric-log.schema";

// Zod schema for the form body only (strip the params)
// TODO: Might need to be refactored later
const formSchema = createMetricLogSchema.shape.body;
type FormInputs = z.infer<typeof formSchema>;

// Props
interface MetricLogModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormInputs) => Promise<void>;
  defaultType?: "manual" | "automatic";
}

export const MetricLogFormModal: React.FC<MetricLogModalProps> = ({
  open,
  onClose,
  onSubmit,
  defaultType = "manual",
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      type: defaultType,
      logValue: undefined,
      loggedAt: new Date(), // e.g., "2025-06-17T12:00"
    },
  });

  // // UseMutation for CREATE request
  // const { mutateAsync: createLog, isLoading: isSubmittingLog } = useMutation({
  //   mutationFn: async (data: FormInputs) => {
  //     // Call the API to create the log entry
  //     // Replace with your actual API call
  //     return await onSubmit(data);
  //   }
  // });

  // Clean up when modal closes
  React.useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  return (
    <Modal isOpen={open} onClose={onClose}>
      <form
        className="w-full max-w-md bg-white p-6 rounded-2xl shadow"
        onSubmit={handleSubmit(async (data) => {
          await onSubmit(data);
          reset();
        })}
      >
        <h2 className="text-xl font-bold mb-4">Add Log Entry</h2>

        {/* Type Field */}
        <div className="mb-4">
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
        </div>

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
            disabled={isSubmitting}
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
