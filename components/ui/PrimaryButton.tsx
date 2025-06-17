import React from "react";

interface PrimaryButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  ariaLabel?: string;
  className?: string;
  disabled?: boolean;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  onClick,
  children,
  ariaLabel,
  className,
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      className={`bg-[#A8C28B] hover:bg-[#7C9B63] text-white px-6 py-2 rounded-xl font-semibold transition ${
        disabled
          ? "opacity-50 cursor-not-allowed bg-gray-400 hover:bg-gray-400"
          : "hover:bg-blue-700"
      } ${className}`}
      aria-label={ariaLabel}
      role="button"
      disabled={disabled}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
