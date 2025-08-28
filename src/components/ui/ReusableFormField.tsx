import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

/**
 * Reusable Form Field Component
 *
 * This component provides a standardized and configurable form field,
 * reducing code duplication and improving maintainability.
 * @deprecated replaced with specific implementation
 */
interface ReusableFormFieldProps {
  label: string;
  type: string;
  register: UseFormRegisterReturn;
  error?: string;
  placeholder?: string;
  isSubmitting?: boolean;
  className?: string;
}

const ReusableFormField: React.FC<ReusableFormFieldProps> = ({
  label,
  type,
  register,
  error,
  placeholder,
  isSubmitting,
  className,
}) => {
  return (
    <div>
      <label className="block text-input-label text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        className={`input-textfield ${className}`}
        placeholder={placeholder}
        {...register}
        onChange={(e) => {
          console.log(`Input ${label} changed:`, e.target.value);
          register.onChange(e); // Trigger react-hook-form's onChange
        }}
        disabled={isSubmitting}
      />
      {/** TODO: Create an error message that persist its size (height), so the form layout not get pushed around when it transitioning from to hidden and showing */}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default ReusableFormField;
