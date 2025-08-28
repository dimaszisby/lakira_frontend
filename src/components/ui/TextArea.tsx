import * as React from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { FieldShell } from "./FieldShell";

type TextAreaFieldProps = {
  id: string;
  label: string;
  registration: UseFormRegisterReturn;
  rows?: number;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string; // wrapper class
  textareaClassName?: string; // textarea element class
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
};

export function TextAreaField({
  id,
  label,
  registration,
  rows = 4,
  placeholder,
  disabled,
  required,
  hint,
  error,
  className,
  textareaClassName,
  onChange,
}: TextAreaFieldProps) {
  return (
    <FieldShell
      id={id}
      label={label}
      required={required}
      error={error}
      hint={hint}
      className={className}
    >
      <textarea
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        className={["input-textfield", textareaClassName]
          .filter(Boolean)
          .join(" ")}
        {...registration}
        onChange={(e) => {
          registration.onChange(e);
          onChange?.(e);
        }}
      />
    </FieldShell>
  );
}
