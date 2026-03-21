
"use client";
import { motion } from "framer-motion";
import React, { useEffect, useCallback, useMemo } from "react";
import { getLegacyBackdropStyle } from "./LegacyBackdrop";

interface ModalOverlayProps {
  children: React.ReactNode;
  onClose: () => void;
  bodyOpacity?: number;
  borderOpacity?: number;
  blurStrength?: number;
}

export function ModalOverlay({
  children,
  onClose,
  bodyOpacity = 0.64,
  borderOpacity = 0.28,
  blurStrength = 5.2,
}: ModalOverlayProps) {
  const supportsBackdropFilter = useMemo(() => {
    if (typeof window === "undefined") return false;
    return (
      window.CSS?.supports?.("backdrop-filter", `blur(${blurStrength}px)`) ||
      window.CSS?.supports?.("-webkit-backdrop-filter", `blur(${blurStrength}px)`)
    );
  }, [blurStrength]);

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  }, [onClose]);

  const handleContentClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const backdropStyle = useMemo(() => {
    const baseStyle = getLegacyBackdropStyle({
      supportsBackdropFilter,
      bodyOpacity,
      borderOpacity,
      blurStrength,
      isScrolled: true,
    });
    return {
      ...baseStyle,
      background: supportsBackdropFilter
        ? `rgba(0, 0, 0, ${bodyOpacity * 0.4})`
        : `rgba(0, 0, 0, ${bodyOpacity * 0.2})`,
      border: `1px solid rgba(128,128,128,${borderOpacity})`,
      boxShadow: "0 1px 10px 0 rgba(0,0,0,0.05)",
    };
  }, [supportsBackdropFilter, bodyOpacity, borderOpacity, blurStrength]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed inset-0 z-[1000] flex items-center justify-center p-2.5"
      style={backdropStyle}
      onClick={handleOverlayClick}
    >
      <div onClick={handleContentClick} className="w-full max-w-[300px] max-h-[90vh] overflow-auto relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
