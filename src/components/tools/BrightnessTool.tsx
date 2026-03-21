"use client";
import React, { useState, useMemo } from "react";
import { useTranslation } from "@/hooks/use-translation";
import { lighten, darken, generateBrightnessSteps } from "@/lib/color-utils";
import { Label } from "@/components/ui/label";
import { CustomSlider } from "@/components/ui/CustomSlider";
import { ResponsiveColorPicker } from "@/components/ResponsiveColorPicker";
import ColorCard from "@/components/ColorCard";
import { cn } from "@/lib/utils";
import CustomCheckbox from "@/components/ui/CustomCheckbox";

export const BrightnessTool = ({
  cardWidth,
  gap,
}: {
  cardWidth: number;
  gap: number;
}) => {
  const { t, isRtl } = useTranslation();
  const [baseColor, setBaseColor] = useState("#00A2FA");
  const [steps, setSteps] = useState(6);
  const [percentage, setPercentage] = useState(50);
  const [mode, setMode] = useState<"lighten" | "darken">("lighten");
  const [isStepMode, setIsStepMode] = useState(true);
  const [showOriginals, setShowOriginals] = useState(true);
  const [scale, setScale] = useState<"linear" | "log">("linear");

  const applyScale = (ratio: number) => {
    if (scale === "log") return Math.log(ratio * (Math.E - 1) + 1);
    return ratio;
  };

  const shades = useMemo(() => {
    try {
      const operation = mode === "lighten" ? lighten : darken;

      if (isStepMode) {
        const results = generateBrightnessSteps(
          baseColor,
          steps,
          operation,
          applyScale,
        );
        if (showOriginals) {
          const target = mode === "lighten" ? "#FFFFFF" : "#000000";
          return [baseColor, ...results, target];
        }
        return results;
      } else {
        const result = operation(baseColor, applyScale(percentage / 100));
        if (showOriginals) return [baseColor, result];
        return [result];
      }
    } catch {
      return [baseColor];
    }
  }, [
    baseColor,
    steps,
    percentage,
    mode,
    isStepMode,
    showOriginals,
    scale,
  ]);

  return (
    <div
      className="flex flex-col h-full"
      style={{ gap: `${gap}px` }}
    >
      <div className="flex flex-col" style={{ gap: "12px" }}>
        <Label className="text-xs tracking-widest text-white/40">
          {t("baseColor")}
        </Label>
        <ResponsiveColorPicker
          id="bright-picker"
          value={baseColor}
          onValueChange={setBaseColor}
          isRTL={isRtl}
          isFullWidth={true}
        />
      </div>

      <div className="flex flex-col" style={{ gap: "12px" }}>
        <Label className="text-xs tracking-widest text-white/40">
          {t("mode")}
        </Label>
        <div
          className={cn(
            "grid gap-4",
            cardWidth >= 520 ? "grid-cols-2" : "grid-cols-1",
          )}
        >
          <div className="grid grid-cols-2 gap-2 p-1 bg-[hsl(var(--background))] rounded-[var(--radius)] border border-[#242424]">
            <button
              onClick={() => setMode("lighten")}
              className={cn(
                "py-2 text-xs rounded-[var(--radius)] transition-all",
                mode === "lighten"
                  ? "bg-primary text-black"
                  : "text-white/40 hover:bg-white/10 hover:text-white",
              )}
            >
              {t("lighten")}
            </button>
            <button
              onClick={() => setMode("darken")}
              className={cn(
                "py-2 text-xs rounded-[var(--radius)] transition-all",
                mode === "darken"
                  ? "bg-primary text-black"
                  : "text-white/40 hover:bg-white/10 hover:text-white",
              )}
            >
              {t("darken")}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 p-1 bg-[hsl(var(--background))] rounded-[var(--radius)] border border-[#242424]">
            <button
              onClick={() => setIsStepMode(true)}
              className={cn(
                "py-2 text-xs rounded-[var(--radius)] transition-all",
                isStepMode
                  ? "bg-primary text-black"
                  : "text-white/40 hover:bg-white/10 hover:text-white",
              )}
            >
              {t("steps")}
            </button>
            <button
              onClick={() => setIsStepMode(false)}
              className={cn(
                "py-2 text-xs rounded-[var(--radius)] transition-all",
                !isStepMode
                  ? "bg-primary text-black"
                  : "text-white/40 hover:bg-white/10 hover:text-white",
              )}
            >
              {t("percentage")}
            </button>
          </div>
        </div>
      </div>

      {isStepMode ? (
        <div className="flex flex-col" style={{ gap: "16px" }}>
          <div className="flex justify-between items-center">
            <Label className="text-xs tracking-widest text-white/40">
              {t("steps")}
            </Label>
            <span className="text-xs font-code text-primary font-bold">
              {steps}
            </span>
          </div>
          <CustomSlider
            id="bright-steps-slider"
            min={1}
            max={176}
            step={1}
            value={steps}
            onValueChange={setSteps}
            isRTL={isRtl}
          />
        </div>
      ) : (
        <div className="flex flex-col" style={{ gap: "16px" }}>
          <div className="flex justify-between items-center">
            <Label className="text-xs tracking-widest text-white/40">
              {t("percentage")}
            </Label>
            <span className="text-xs font-code text-primary font-bold">
              {percentage}%
            </span>
          </div>
          <CustomSlider
            id="bright-percentage-slider"
            min={0}
            max={100}
            step={1}
            value={percentage}
            onValueChange={setPercentage}
            isRTL={isRtl}
          />
        </div>
      )}

      <div className="flex flex-col" style={{ gap: "12px" }}>
        <Label className="text-xs tracking-widest text-white/40">
          {t("scale")}
        </Label>
        <div
          className="grid gap-4 grid-cols-1"
        >
          <div className="grid grid-cols-2 gap-2 p-1 bg-[hsl(var(--background))] rounded-[var(--radius)] border border-[#242424]">
            <button
              onClick={() => setScale("linear")}
              className={cn(
                "py-2 text-xs rounded-[var(--radius)] transition-all",
                scale === "linear"
                  ? "bg-primary text-black"
                  : "text-white/40 hover:bg-white/10 hover:text-white",
              )}
            >
              {t("linear")}
            </button>
            <button
              onClick={() => setScale("log")}
              className={cn(
                "py-2 text-xs rounded-[var(--radius)] transition-all",
                scale === "log"
                  ? "bg-primary text-black"
                  : "text-white/40 hover:bg-white/10 hover:text-white",
              )}
            >
              {t("logarithmic")}
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <CustomCheckbox
          checked={showOriginals}
          onChange={setShowOriginals}
          direction={isRtl ? "rtl" : "ltr"}
          label={t("showOriginals")}
          labelSpacing={8}
        />
      </div>

      <div
        className="grid flex-1"
        style={{
          gap: `${gap}px`,
          gridTemplateColumns:
            "repeat(auto-fill, minmax(min(100%, 336px), 1fr))",
        }}
      >
        {shades.map((color, idx) => (
          <ColorCard
            key={`${color}-${idx}`}
            hexColor={color}
            isRTL={isRtl}
          />
        ))}
      </div>
    </div>
  );
};
