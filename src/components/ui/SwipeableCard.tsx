// src/components/ui/SwipeableCard.tsx

"use client";

import { motion, useMotionValue, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";

interface SwipeAction {
  label: string;
  onClick: () => void;
  color?: string; // Tailwind color class
  icon?: React.ReactNode;
}

interface SwipeableCardProps {
  children: React.ReactNode;
  actions: SwipeAction[];
  open?: boolean;
  onClose?: () => void;
}

function getRoundedClass(index: number, total: number) {
  if (index === 0) return "rounded-l-xl";
  if (index === total - 1) return "rounded-r-2xl";
  return "";
}

const SWIPE_THRESHOLD = 0.4; // % of button area width

function SwipeableCard({
  children,
  actions,
  open = false,
  onClose,
}: SwipeableCardProps) {
  const cardWidth = actions.length * 64; // px
  const x = useMotionValue(0);
  const controls = useAnimation();
  const dragRef = useRef<HTMLDivElement | null>(null);

  // If "open" prop changes, animate
  useEffect(() => {
    controls.start({ x: open ? -cardWidth : 0 });
  }, [open, cardWidth, controls]);

  // Click outside to close (optional)
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        open &&
        dragRef.current &&
        !dragRef.current.contains(e.target as Node)
      ) {
        onClose?.();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose]);

  // * Styling Variables
  const cornerRadius = "rounded-2xl"; // Tailwind's rounded-xl equivalent

  return (
    <div className="relative w-full select-none">
      {/* Actions (behind card) */}
      <div className="absolute inset-y-0 right-0 flex z-0 h-full">
        {actions.map((action, i) => (
          <button
            key={i}
            onClick={() => {
              action.onClick();
              onClose?.(); // Optionally close after action
            }}
            className={`relative w-16 h-full flex items-center justify-center 
        text-white text-2xl  ${getRoundedClass(i, actions.length)}
        ${action.color || "bg-red-500"}
        hover:brightness-90 active:scale-95 transition-all duration-200`}
            aria-label={action.label}
            tabIndex={0}
            type="button"
          >
            {action.icon || action.label}
          </button>
        ))}
      </div>

      {/* Card (swipeable) */}
      <motion.div
        ref={dragRef}
        className={`relative z-10 bg-white ${cornerRadius} border p-4 cursor-grab active:cursor-grabbing touch-pan-x`}
        drag="x"
        dragDirectionLock
        dragConstraints={{ left: -cardWidth, right: 0 }}
        dragElastic={0.15}
        style={{ x }}
        onDragEnd={(_, info) => {
          const percentDragged = Math.abs(info.offset.x) / cardWidth;
          if (info.offset.x < 0 && percentDragged > SWIPE_THRESHOLD) {
            controls.start({ x: -cardWidth });
          } else {
            controls.start({ x: 0 });
            onClose?.();
          }
        }}
        animate={controls}
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
        onClick={() => {
          // If open, close on tap
          if (x.get() === -cardWidth) {
            controls.start({ x: 0 });
            onClose?.();
          }
        }}
        role="group"
        tabIndex={0}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default SwipeableCard;
