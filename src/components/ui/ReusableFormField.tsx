// components/ui/ReusableFormField.tsx

import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

/**
 * Reusable Form Field Component
 *
 * This component provides a standardized and configurable form field,
 * reducing code duplication and improving maintainability.
 */
interface ReusableFormFieldProps {
  /**
   * The label for the form field.
   */
  label: string;
  /**
   * The type of input field (e.g., "text", "number", "email").
   */
  type: string;
  /**
   * The register function from react-hook-form.
   */
  register: UseFormRegisterReturn;
  /**
   * The error message to display (optional).
   */
  error?: string;
  /**
   * The placeholder text for the input field (optional).
   */
  placeholder?: string;
  /**
   * Whether the form is submitting.
   */
  isSubmitting?: boolean;
}

const ReusableFormField: React.FC<ReusableFormFieldProps> = ({
  label,
  type,
  register,
  error,
  placeholder,
  isSubmitting,
}) => {
  return (
    <div>
      <label className="block text-input-label text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        className="input-textfield"
        placeholder={placeholder}
        {...register}
        onChange={(e) => {
          console.log(`Input ${label} changed:`, e.target.value);
          register.onChange(e); // Trigger react-hook-form's onChange
        }}
        disabled={isSubmitting}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default ReusableFormField;
