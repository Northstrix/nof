
"use client";
import React, { useState, useMemo } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { getColorHarmonies, ColorHarmony } from '@/lib/color-utils';
import { Label } from '@/components/ui/label';
import { ModeSelector } from '../ModeSelector';
import { ResponsiveColorPicker } from '../ResponsiveColorPicker';
import ColorCard from '../ColorCard';
import { cn } from '@/lib/utils';

export const PaletteTool = ({ cardWidth, gap }: { cardWidth: number, gap: number }) => {
  const { t, isRtl } = useTranslation();
  const [baseColor, setBaseColor] = useState('#00A2FA');
  const [mode, setMode] = useState<ColorHarmony>('square');

  const harmonies = useMemo(() => getColorHarmonies(baseColor), [baseColor]);
  const palette = (harmonies as any)[mode] || [baseColor];

  const harmonyOptions = [
    { value: "analogous", label: t("analogous") },
    { value: "triad", label: t("triad") },
    { value: "complementary", label: t("complementary") },
    { value: "splitComplementary", label: t("splitComplementary") },
    { value: "square", label: t("square") },
    { value: "tetradic", label: t("tetradic") },
    { value: "convergence", label: t("convergence") },
  ];

  const isWide = cardWidth >= 1280;

  return (
    <div className="flex flex-col h-full" style={{ gap: `${gap}px` }}>
      <div 
        className={cn("grid", isWide ? "grid-cols-2" : "grid-cols-1")}
        style={{ gap: `${gap}px` }}
      >
        <div className="flex flex-col" style={{ gap: `12px` }}>
          <Label className="text-xs tracking-widest text-white/40">{t('baseColor')}</Label>
          <ResponsiveColorPicker 
            key={`pal-${isWide}`} 
            id="palette-picker" 
            value={baseColor} 
            onValueChange={setBaseColor} 
            isRTL={isRtl}
            isFullWidth={!isWide}
          />
        </div>

        <div className="flex flex-col" style={{ gap: `12px` }}>
          <Label className="text-xs tracking-widest text-white/40">{t('mode')}</Label>
          <ModeSelector 
            options={harmonyOptions} 
            value={mode} 
            onValueChange={(v) => setMode(v as ColorHarmony)}
            isHeightFixed={isWide}
          />
        </div>
      </div>

      <div 
        className="grid flex-1"
        style={{ 
          gap: `${gap}px`,
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 336px), 1fr))' 
        }}
      >
        {palette.map((color: string, idx: number) => (
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
