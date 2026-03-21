
"use client";
import { useState, useMemo } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { mix, MixMode, generateSteps } from '@/lib/color-utils';
import { Label } from '@/components/ui/label';
import { CustomSlider } from '../ui/CustomSlider';
import { ResponsiveColorPicker } from '../ResponsiveColorPicker';
import ColorCard from '../ColorCard';
import { cn } from '@/lib/utils';
import CustomCheckbox from '../ui/CustomCheckbox';
import { FloatingLabelCombobox } from '@/components/ui/floating-label-combobox';
import { ModeSelector } from '../ModeSelector';

export const MixTool = ({ cardWidth, gap }: { cardWidth: number, gap: number }) => {
  const { t, isRtl } = useTranslation();
  const [color1, setColor1] = useState('#00A2FA');
  const [color2, setColor2] = useState('#FA00A2');
  const [steps, setSteps] = useState(6);
  const [percentage, setPercentage] = useState(50);
  const [mode, setMode] = useState<MixMode>('rgb');
  const [isStepMode, setIsStepMode] = useState(true);
  const [showOriginals, setShowOriginals] = useState(true);
  const [aperture, setAperture] = useState(0.5);
  const [scale, setScale] = useState<'linear' | 'log'>('linear');
  const isTwoColumnModeScale = cardWidth >= 520;

  const modeOptions = [
    { value: 'rgb', label: 'RGB' },
    { value: 'hsl', label: 'HSL' },
    { value: 'hsv', label: 'HSV' },
    { value: 'lab', label: 'LAB' },
    { value: 'lch', label: 'LCH' },
    { value: 'log', label: t('logarithmic') },
    { value: 'parabolic', label: t('parabolic') },
    { value: 'quadratic', label: t('quadratic') },
  ];

  const scaleOptions = [
    { value: 'linear', label: t('linear') },
    { value: 'log', label: t('logarithmic') },
  ];

  const applyScale = (ratio: number) => {
    if (scale === 'log') return Math.log(ratio * (Math.E - 1) + 1);
    return ratio;
  };

  const isWide = cardWidth >= 1280;

  const mixedColors = useMemo(() => {
    try {
      let results: string[] = [];
      if (isStepMode) {
        results = generateSteps(color1, color2, steps, (c1, c2, r) => {
          return mix(c1, c2, applyScale(r), mode, aperture);
        });
        if (showOriginals) return [color1, ...results, color2];
        return results;
      } else {
        const ratio = applyScale(percentage / 100);
        const result = mix(color1, color2, ratio, mode, aperture);
        if (showOriginals) return [color1, result, color2];
        return [result];
      }
    } catch {
      return [color1];
    }
  }, [color1, color2, steps, percentage, mode, isStepMode, showOriginals, aperture, scale]);

  return (
    <div className="flex flex-col h-full" style={{ gap: `${gap}px` }}>
      <div 
        className={cn("grid", isWide ? "grid-cols-2" : "grid-cols-1")}
        style={{ gap: `${gap}px` }}
      >
        <div className="flex flex-col" style={{ gap: `12px` }}>
          <Label className="text-xs tracking-widest text-white/40">{t('firstColor')}</Label>
          <ResponsiveColorPicker 
            key={`mix-1-${isWide}`} 
            id="mix-picker-1" 
            value={color1} 
            onValueChange={setColor1} 
            isRTL={isRtl}
            isFullWidth={!isWide}
          />
        </div>
        <div className="flex flex-col" style={{ gap: `12px` }}>
          <Label className="text-xs tracking-widest text-white/40">{t('secondColor')}</Label>
          <ResponsiveColorPicker 
            key={`mix-2-${isWide}`} 
            id="mix-picker-2" 
            value={color2} 
            onValueChange={setColor2} 
            isRTL={isRtl}
            isFullWidth={!isWide}
          />
        </div>
      </div>

      <div className="flex flex-col" style={{ gap: '12px' }}>
        <Label className="text-xs tracking-widest text-white/40">{t('mode')}</Label>
        <div className="grid grid-cols-2 gap-2 p-1 bg-[hsl(var(--background))] rounded-[var(--radius)] border border-[#242424]">
          <button
            onClick={() => setIsStepMode(true)}
            className={cn(
              "py-2 text-xs rounded-[var(--radius)] transition-all",
              isStepMode ? "bg-primary text-black" : "text-white/40 hover:bg-white/10 hover:text-white"
            )}
          >
            {t('steps')}
          </button>
          <button
            onClick={() => setIsStepMode(false)}
            className={cn(
              "py-2 text-xs rounded-[var(--radius)] transition-all",
              !isStepMode ? "bg-primary text-black" : "text-white/40 hover:bg-white/10 hover:text-white"
            )}
          >
            {t('percentage')}
          </button>
        </div>
      </div>

      {isStepMode ? (
        <div className="flex flex-col" style={{ gap: `16px` }}>
          <div className="flex justify-between items-center">
            <Label className="text-xs tracking-widest text-white/40">{t('steps')}</Label>
            <span className="text-xs font-code text-primary font-bold">{steps}</span>
          </div>
          <CustomSlider id="mix-steps-slider" min={1} max={176} step={1} value={steps} onValueChange={setSteps} isRTL={isRtl} />
        </div>
      ) : (
        <div className="flex flex-col" style={{ gap: `16px` }}>
          <div className="flex justify-between items-center">
            <Label className="text-xs tracking-widest text-white/40">{t('percentage')}</Label>
            <span className="text-xs font-code text-primary font-bold">{percentage}%</span>
          </div>
          <CustomSlider id="mix-pct-slider" min={0} max={100} step={1} value={percentage} onValueChange={setPercentage} isRTL={isRtl} />
        </div>
      )}

      <div
        className={cn(
          "grid gap-4",
          isTwoColumnModeScale ? "grid-cols-2" : "grid-cols-1"
        )}
      >
        {/* MIX MODE */}
        {isTwoColumnModeScale ? (
          // side by side -> both use FloatingLabelCombobox
          <FloatingLabelCombobox
            label={t('mixMode')}
            value={mode}
            onValueChange={(v) => setMode(v as MixMode)}
            options={modeOptions}
            className="bg-[hsl(var(--background))] border border-[var(--border-color)] rounded-[var(--radius)]"
            contentClassName="bg-[hsl(var(--background))]"
          />
        ) : (
          <div className="flex flex-col" style={{ gap: "12px" }}>
            <Label className="text-xs tracking-widest text-white/40">
              {t("mixMode")}
            </Label>
            <ModeSelector
              options={modeOptions}
              value={mode}
              onValueChange={(v) => setMode(v as MixMode)}
              isHeightFixed={false} // auto height on mobile
            />
          </div>
        )}

        {/* SCALE */}
        {isTwoColumnModeScale ? (
          // side by side -> FloatingLabelCombobox
          <FloatingLabelCombobox
            label={t('scale')}
            value={scale}
            onValueChange={(v) => setScale(v as 'linear' | 'log')}
            options={scaleOptions}
            className="bg-[hsl(var(--background))] border border-[var(--border-color)] rounded-[var(--radius)]"
            contentClassName="bg-[hsl(var(--background))]"
          />
        ) : (
          // stacked -> segmented control (your provided code)
          <div className="flex flex-col" style={{ gap: '12px' }}>
            <Label className="text-xs tracking-widest text-white/40">
              {t('scale')}
            </Label>
            <div className="grid gap-4 grid-cols-1">
              <div className="grid grid-cols-2 gap-2 p-1 bg-[hsl(var(--background))] rounded-[var(--radius)] border border-[#242424]">
                <button
                  onClick={() => setScale('linear')}
                  className={cn(
                    "py-2 text-xs rounded-[var(--radius)] transition-all",
                    scale === 'linear'
                      ? "bg-primary text-black"
                      : "text-white/40 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {t('linear')}
                </button>
                <button
                  onClick={() => setScale('log')}
                  className={cn(
                    "py-2 text-xs rounded-[var(--radius)] transition-all",
                    scale === 'log'
                      ? "bg-primary text-black"
                      : "text-white/40 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {t('logarithmic')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {mode === 'quadratic' && (
        <div className="flex flex-col" style={{ gap: `16px` }}>
          <div className="flex justify-between items-center">
            <Label className="text-xs tracking-widest text-white/40">{t('aperture')}</Label>
            <span className="text-xs font-code text-primary font-bold">{aperture.toFixed(2)}</span>
          </div>
          <CustomSlider id="aperture-slider" min={0} max={1} step={0.01} value={aperture} onValueChange={setAperture} isRTL={isRtl} />
        </div>
      )}

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
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 336px), 1fr))' 
        }}
      >
        {mixedColors.map((color, idx) => (
          <ColorCard 
            key={`${color}-${idx}`} 
            hexColor={color} 
            isRTL={isRtl}
            percentageTagValue={!isStepMode && idx === 1 ? `${percentage}%` : undefined}
            showPercentageTag={!isStepMode && idx === 1}
          />
        ))}
      </div>
    </div>
  );
};
