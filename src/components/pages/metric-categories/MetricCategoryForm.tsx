import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ReusableFormField from "@/components/ui/ReusableFormField";

// types
import {
  CreateMetricCategoryRequestDTO,
  MetricCategoryResponseDTO,
} from "@/src/types/dtos/metric-category.dto";

import {
  MetricCategoryFormInput,
  metricCategoryFormSchema,
} from "@/src/features/metricCategories/types";
import {
  useCreateMetricCategory,
  useDeleteMetricCategory,
  useUpdateMetricCategory,
} from "@/src/features/metricCategories/hooks";
import Modal from "../../ui/Modal";
import PrimaryButton from "../../ui/PrimaryButton";
import { useQueryClient } from "@tanstack/react-query";
import ErrorMessage from "../../ui/ErrorMessage";

interface MetricCategoryModalProps {
  open: boolean;
  onClose: () => void;
  categoryId: string | null;
  initialCategory: MetricCategoryResponseDTO | null;
}

const MetricCategoryForm = ({
  open,
  onClose,
  categoryId,
  initialCategory,
}: MetricCategoryModalProps) => {
  const isEditMode = !!initialCategory;
  const queryClient = useQueryClient();

  // * Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
    setValue,
  } = useForm<CreateMetricCategoryRequestDTO>({
    resolver: zodResolver(metricCategoryFormSchema),
    mode: "onChange",
    defaultValues: isEditMode
      ? {
          name: initialCategory?.name,
          color: initialCategory?.color,
          icon: initialCategory?.icon,
        }
      : {
          name: "",
          color: "",
          icon: "",
        },
  });

  useEffect(() => {
    if (open && isEditMode && initialCategory) {
      setValue("name", initialCategory.name);
      setValue("color", initialCategory.color);
      setValue("icon", initialCategory.icon);
    }
  }, [open, isEditMode, initialCategory, categoryId, setValue, reset]);

  // * Mutation Hooks
  const {
    createMetricCategory,
    isPending: isCreating,
    error: createError,
  } = useCreateMetricCategory(async () => {
    queryClient.invalidateQueries({ queryKey: ["metricCategories"] });
  });

  const {
    updateMetricCategory,
    isPending: isUpdating,
    error: updateError,
  } = useUpdateMetricCategory(async () => {
    queryClient.invalidateQueries({ queryKey: ["metricCategories"] });
  });

  const {
    deleteMetricCategory,
    isPending: isDeleting,
    error: deleteError,
  } = useDeleteMetricCategory(async () => {
    queryClient.invalidateQueries({ queryKey: ["metricCategories"] });
  });

  // * Handlers
  const onSubmit = async (data: MetricCategoryFormInput) => {
    if (!isValid) {
      console.log("Form is not valid, preventing submission.");
      return;
    }

    try {
      if (isEditMode && initialCategory && categoryId) {
        await updateMetricCategory({ categoryId: categoryId, category: data });
      } else {
        await createMetricCategory(data);
      }
      reset();
      onClose();
    } catch (error) {
      console.error("Error creating metric log:", error);
    }
  };

  const onDeleteSubmit = async () => {
    if (!initialCategory) return;
    try {
      await deleteMetricCategory(initialCategory.id);
      reset();
      onClose();
    } catch (error) {
      console.error("Error deleting metric log:", error);
    }
  };

  // * Computed Value
  const errorMsg =
    createError?.message || updateError?.message || deleteError?.message || "";

  return (
    <Modal isOpen={open} onClose={onClose}>
      <form
        className="bg-white p-6 max-w-lg min-w-96 mx-auto"
        onSubmit={handleSubmit((data) => {
          if (Object.keys(errors).length > 0) {
            console.log("Form has errors, preventing submission.");
            return;
          }
          onSubmit(data);
        })}
      >
        <h2 className="text-xl font-semibold mb-4">Manage Category</h2>

        {/* Error Message */}
        <ErrorMessage message={errorMsg}></ErrorMessage>

        <ReusableFormField
          label="Name"
          type="text"
          register={register("name")}
          placeholder="i.e Muscle Group Growth"
          isSubmitting={isSubmitting || isCreating || isUpdating}
        />

        <ReusableFormField
          label="Icon"
          type="text"
          register={register("icon")}
          placeholder="e.g., km, reps, hours"
          error={errors.icon?.message}
          isSubmitting={isSubmitting || isCreating || isUpdating}
        />

        <ReusableFormField
          label="color"
          type="text"
          register={register("color")}
          placeholder="#000000"
          error={errors.color?.message}
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

export default MetricCategoryForm;
