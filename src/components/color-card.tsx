'use client';

import React from 'react';
import { type HsvaColor, hexToHsva } from '@uiw/color-convert';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/use-translation';
import { ContrastRatioInfo as BaseContrastRatioInfo } from './color-picker';
import { motion, useAnimation, useReducedMotion } from 'framer-motion';
import useIsRTL from '@/hooks/use-is-rtl';
import clsx from 'clsx';

// You must install uuid: npm install uuid
import { v4 as uuidv4 } from 'uuid';

// Memoized ContrastRatioInfo to prevent unnecessary re-renders.
const ContrastRatioInfo = React.memo(BaseContrastRatioInfo, (prev, next) => {
  const p = prev.color;
  const n = next.color;
  return (
    Math.abs(p.h - n.h) < 0.0001 &&
    Math.abs(p.s - n.s) < 0.0001 &&
    Math.abs(p.v - n.v) < 0.0001 &&
    Math.abs(p.a - n.a) < 0.0001
  );
});

interface CopyIconProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
  duration?: number;
  isHovered?: boolean;
  uniqueId: string;
}

const CopyIcon = React.memo(
  React.forwardRef<HTMLDivElement, CopyIconProps>(
    ({ size = 28, duration = 1, isHovered, className, uniqueId, ...props }, ref) => {
      const controls = useAnimation();
      const reduced = useReducedMotion();

      React.useEffect(() => {
        if (reduced) return;
        controls.start(isHovered ? 'animate' : 'normal');
      }, [controls, isHovered, reduced]);

      const defaultTransition = { type: 'spring', stiffness: 160, damping: 17, mass: 1 };

      const boxVariants = {
        normal: { translateY: 0, translateX: 0, rotate: 0 },
        animate: { translateY: -3, translateX: -3, rotate: 360 },
      };

      const pathVariants = {
        normal: { x: 0, y: 0 },
        animate: { x: 3, y: 3 },
      };

      return (
        <motion.div
          ref={ref}
          id={`copy-icon-${uniqueId}`}
          style={{
            color: isHovered ? 'hsl(var(--background))' : 'hsl(var(--foreground))',
            backgroundColor: isHovered ? 'hsl(var(--accent))' : 'transparent',
            borderRadius: 'var(--radius)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          className={className}
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
          >
            <motion.rect
              id={`copy-rect-${uniqueId}`}
              width="14"
              height="14"
              x="8"
              y="8"
              rx="2"
              ry="2"
              variants={boxVariants}
              animate={controls}
              transition={{ ...defaultTransition, duration: 0.7 * duration }}
            />
            <motion.path
              id={`copy-path-${uniqueId}`}
              d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
              variants={pathVariants}
              animate={controls}
              transition={defaultTransition}
            />
          </motion.svg>
        </motion.div>
      );
    }
  )
);

CopyIcon.displayName = 'CopyIcon';

interface ColorCardProps {
  hexColor: string;
  percentage?: number;
}

// UUID generation fallback helper
const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return uuidv4();
};

export const ColorCard = React.memo(function ColorCard({ hexColor, percentage }: ColorCardProps) {
  // Generate stable uniqueId only once per component instance
  const uniqueId = React.useMemo(() => generateUUID(), []);

  const { toast } = useToast();
  const { t } = useTranslation();
  const isRTL = useIsRTL();
  const [isHovered, setIsHovered] = React.useState(false);

  const deferredColor = React.useDeferredValue(hexColor);

  const colorHsv = React.useMemo(() => {
    try {
      return hexToHsva(deferredColor);
    } catch {
      return { h: 0, s: 0, v: 0, a: 1 } as HsvaColor;
    }
  }, [deferredColor]);

  const handleCopy = React.useCallback(() => {
    const upperHexColor = hexColor.toUpperCase();

    const showToast = (title: string, description: string, isError = false) => {
      toast({ title, description, variant: isError ? "destructive" : "default" });
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(upperHexColor)
        .then(() => showToast(t("copied"), upperHexColor))
        .catch(() => showToast(t("copy_failed"), t("unable_to_copy"), true));
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = upperHexColor;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);
        showToast(successful ? t("copied") : t("copy_failed"), upperHexColor, !successful);
      } catch {
        document.body.removeChild(textArea);
        showToast(t("copy_failed"), t("unable_to_copy"), true);
      }
    }
  }, [hexColor, t, toast]);

  const percentageTag = React.useMemo(
    () =>
      percentage != null && (
        <div
          id={`percentage-${uniqueId}`}
          className={clsx(
            'absolute top-2 text-white text-xs font-mono bg-black/30 backdrop-blur-sm rounded-full px-2 py-0.5 transition-opacity duration-200',
            { 'opacity-0': percentage === 0, 'opacity-100': percentage !== 0 }
          )}
          style={{
            right: isRTL ? '0.5rem' : 'auto',
            left: isRTL ? 'auto' : '0.5rem',
            direction: 'ltr',
          }}
        >
          {percentage.toFixed(2)}%
        </div>
      ),
    [percentage, isRTL, uniqueId]
  );

  return (
    <div
      id={`color-card-${uniqueId}`}
      className="bg-black border border-border rounded-lg p-3 space-y-3 flex flex-col will-change-transform"
      style={{ minWidth: 316 }}
    >
      <motion.div
        layout
        id={`color-block-${uniqueId}`}
        className="relative w-full h-24 rounded-lg transition-colors duration-200 ease-out"
        style={{ backgroundColor: hexColor }}
      >
        {percentageTag}
      </motion.div>
      <div className="flex items-center justify-between gap-2">
        <code className="font-mono text-sm truncate" style={{ direction: 'ltr' }}>
          {hexColor.toUpperCase()}
        </code>
        <Button
          id={`copy-btn-${uniqueId}`}
          variant="ghost"
          size="icon"
          className="h-7 w-7 flex-shrink-0 group"
          onClick={handleCopy}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <CopyIcon size={16} isHovered={isHovered} uniqueId={uniqueId} />
          <span className="sr-only">Copy color</span>
        </Button>
      </div>
      <ContrastRatioInfo color={colorHsv} />
    </div>
  );
});
