"use client";

import { ReactNode } from "react";
import { X } from "phosphor-react";

interface Modal {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: Modal) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-2xl shadow-lg p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-700 hover:text-red-500"
          onClick={onClose}
          aria-label="Close Modal"
        >
          <X size={24} />
        </button>
        {children}
      </div>
    </div>
  );
}
