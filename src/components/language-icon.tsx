"use client";

import { cn } from "@/lib/utils";
import type { Variants } from "framer-motion";
import { motion, useAnimation, useReducedMotion } from "framer-motion";
import { useCallback, useImperativeHandle, useRef, forwardRef } from "react";

export interface LanguageIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface LanguageIconProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
  duration?: number;
}

export function LanguageIcon({
  onMouseEnter,
  onMouseLeave,
  className,
  size = 28,
  duration = 1,
  ...props
}: LanguageIconProps) {
  const controls = useAnimation();
  const pathControls = useAnimation();
  const reduced = useReducedMotion();
  const isControlled = useRef(false);

  useImperativeHandle(useRef(null), () => ({
    startAnimation: () => {
      if (reduced) {
        controls.start("normal");
        pathControls.start("normal");
      } else {
        controls.start("animate");
        pathControls.start("animate");
      }
    },
    stopAnimation: () => {
      controls.start("normal");
      pathControls.start("normal");
    },
  }));

  const handleEnter = useCallback(
    (e?: React.MouseEvent<HTMLDivElement>) => {
      if (reduced) return;
      if (!isControlled.current) {
        controls.start("animate");
        pathControls.start("animate");
      } else {
        onMouseEnter?.(e as any);
      }
    },
    [controls, pathControls, reduced, onMouseEnter],
  );

  const handleLeave = useCallback(
    (e?: React.MouseEvent<HTMLDivElement>) => {
      if (!isControlled.current) {
        controls.start("normal");
        pathControls.start("normal");
      }
      onMouseLeave?.(e as any);
    },
    [controls, pathControls, onMouseLeave],
  );

  const svgVariants: Variants = {
    normal: { scale: 1, rotate: 0 },
    animate: {
      scale: [1, 1.05, 1],
      rotate: [0, -5, 5, 0],
      transition: { duration: 1.2 * duration, ease: "easeInOut" },
    },
  };

  const pathVariants: Variants = {
    normal: { pathLength: 1, opacity: 1 },
    animate: {
      pathLength: [0, 1],
      opacity: [0.6, 1],
      transition: { duration: 0.9 * duration, ease: "easeInOut" },
    },
  };

  return (
    <motion.div
      className={cn("inline-flex items-center justify-center", className)}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      {...props}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={controls}
        initial="normal"
        variants={svgVariants}
      >
        <motion.path
          d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
          variants={pathVariants}
          initial="normal"
          animate={pathControls}
        />
        <motion.path
          d="M2 12h20"
          variants={pathVariants}
          initial="normal"
          animate={pathControls}
        />
        <motion.path
          d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
          variants={pathVariants}
          initial="normal"
          animate={pathControls}
        />
      </motion.svg>
    </motion.div>
  );
}
