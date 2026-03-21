
"use client";
import React, { useRef, useState, useEffect } from "react";
import ColorPicker from "./ColorPicker";
import { useTranslation } from "@/hooks/use-translation";

interface ResponsiveColorPickerProps {
  id?: string;
  value: string;
  onValueChange: (val: string) => void;
  isRTL: boolean;
  isFullWidth?: boolean;
}

export function ResponsiveColorPicker({ id = "default", value, onValueChange, isRTL, isFullWidth = false }: ResponsiveColorPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const { t, locale } = useTranslation();

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      setWidth(entries[0].contentRect.width);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const isLarge = width >= 512;

  const hLabel = isLarge ? t("hue") : "H";
  const sLabel = isLarge ? t("saturation") : "S";
  const lLabel = isLarge ? t("luminosity") : "L";
  const rLabel = isLarge ? t("red") : "R";
  const gLabel = isLarge ? t("green") : "G";
  const bLabel = isLarge ? t("blue") : "B";

  const props = {
    id,
    value,
    onValueChange,
    isRTL,
    modeLabel: t("mode"),
    contrastLabel: t("contrastRatio"),
    contrastFormat: (isRTL ? "1:value" : "value:1") as "value:1" | "1:value",
    colorPreviewAreaText: locale === 'he' ? 'ל' : 'A',
    rLabel,
    gLabel,
    bLabel,
    hLabel,
    sLabel,
    lLabel,
    hexLabel: "HEX",
    rgbLabel: "RGB",
    hslLabel: "HSL",
    // Enforced Rounding Props
    containerRadius: "var(--radius)",
    saturationRadius: "var(--radius)",
    inputRadius: "var(--radius)",
    dropdownRadius: "var(--radius)",
    previewRadius: "var(--radius)",
    floatingLabelRadius: "var(--radius)",
    dropdownMenuRadius: "var(--radius)",
    badgeBorderRadius: "100px",
    // Dynamic Saturation Height
    saturationHeight: isFullWidth ? 220 : 140,
  };

  return (
    <div ref={containerRef} className="w-full">
      <ColorPicker {...props} />
    </div>
  );
}
