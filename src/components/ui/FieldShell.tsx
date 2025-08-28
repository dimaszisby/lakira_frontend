import * as React from "react";
import { cn } from "../../../src/lib/cn";

type ControlProps =
  | React.InputHTMLAttributes<HTMLInputElement>
  | React.TextareaHTMLAttributes<HTMLTextAreaElement>
  | React.SelectHTMLAttributes<HTMLSelectElement>;

type FieldShellProps = {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactElement<ControlProps>;
};

export function FieldShell({
  id,
  label,
  required,
  error,
  hint,
  className,
  children,
}: FieldShellProps) {
  const describedBy = error ? `${id}-msg` : hint ? `${id}-msg` : undefined;

  return (
    <div className={cn("w-full", className)}>
      <label htmlFor={id} className="block text-input-label text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {React.cloneElement(children, {
        id,
        "aria-invalid": !!error,
        "aria-describedby": describedBy,
      })}

      {/* Reserve space to avoid layout shift; announce errors politely */}
      <p
        id={`${id}-msg`}
        role={error ? "alert" : undefined}
        aria-live={error ? "polite" : undefined}
        className={cn(
          "mt-1 text-sm min-h-[1.25rem]",
          error ? "text-red-500" : "text-gray-500"
        )}
      >
        {error ?? hint ?? "\u00A0"}
      </p>
    </div>
  );
}
