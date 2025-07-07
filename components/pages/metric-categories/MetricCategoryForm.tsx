"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ReusableFormField from "@/components/ui/ReusableFormField";

// types
import { CreateMetricCategoryRequestDTO } from "@/src/types/dtos/metric-category.dto";
import { createMetricCategorySchema } from "@/src/types/api/zod-metric-category.schema";
import { createMetricCategory } from "@/utils/interactors/metric-category.api";

// TODO 1: Add dynamic form title based on create or update view
// TODO 2: Add dynamic textfield value if on update view

export default function MetricCategoryForm({
  onClose,
}: {
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // React Hook Form with Zod Validation
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CreateMetricCategoryRequestDTO>({
    resolver: zodResolver(createMetricCategorySchema.shape.body),
    mode: "onChange",
  });

  // UseMutation for API request
  const { mutateAsync, error: mutationError } = useMutation({
    mutationFn: createMetricCategory,
    onSuccess: () => {
      console.log("Mutation succeeded");
      queryClient.invalidateQueries({ queryKey: ["categories"] }); // TODO: Ensure query keys is correct
      onClose();
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      setIsSubmitting(false);
    },
  });

  // Form Submit Handler
  const onSubmit = async (
    data: z.infer<typeof createMetricCategorySchema>["body"]
  ) => {
    console.log("onSubmit called with data:", data);
    setIsSubmitting(true);
    try {
      // Add isPublic field with default value
      const categoryData = {
        ...data,
        isPublic: true, // Setting default value as per schema
      };
      console.log("Submitting metric category data:", categoryData);
      await mutateAsync(categoryData);
      console.log("mutateAsync completed successfully");
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 max-w-lg min-w-96 mx-auto">
      <h2 className="text-xl font-semibold mb-4">Manage Metric</h2>

      {mutationError && (
        <div className="text-red-500 mb-4">
          Error creating metric: {mutationError.message}
        </div>
      )}

      <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
        <ReusableFormField
          label="Name"
          type="text"
          register={register("name")}
          placeholder="i.e Muscle Group Growth"
        />

        <ReusableFormField
          label="Icon"
          type="text"
          register={register("icon")}
          placeholder="e.g., km, reps, hours"
          error={errors.icon?.message}
        />

        <ReusableFormField
          label="color"
          type="text"
          register={register("color")}
          placeholder="#000000" //TODO: Create a color picker here
          error={errors.color?.message}
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
