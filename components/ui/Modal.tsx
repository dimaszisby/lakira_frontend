// compnent/ui/Modal.tsx

"use client";

import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-lg shadow-lg p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-700 hover:text-red-500"
          onClick={onClose}
          aria-label="Close Modal"
        >
          ❌
        </button>
        {children}
      </div>
    </div>
  );
}
