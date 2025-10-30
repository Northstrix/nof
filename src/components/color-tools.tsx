'use client';
import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { FloatingLabelInput } from './ui/floating-label-input';
import * as colorUtil from '@/lib/color-utils';
import { ColorCard } from './color-card';
import { CustomSlider } from './ui/custom-slider';
import { FloatingLabelCombobox } from './ui/floating-label-combobox';
import { Label } from './ui/label';
import CustomCheckbox from "@/components/CustomCheckbox";
import CustomRadio from "@/components/CustomRadio"
import { RadioGroup } from './ui/radio-group';
import { useIsMobile } from '@/hooks/use-mobile';
import useIsRTL from '@/hooks/use-is-rtl';

interface ColorToolsProps {
  baseColor: string;
  activeTab: 'mix' | 'brightness';
}

type Scale = 'linear' | 'log';

export function ColorTools({ baseColor: initialBaseColor, activeTab }: ColorToolsProps) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const isRTL = useIsRTL();
  const [baseColor, setBaseColor] = useState(initialBaseColor);
  const [brightnessMode, setBrightnessMode] = useState<'lighten' | 'darken'>('lighten');
  const [brightnessPercentage, setBrightnessPercentage] = useState(50);
  const [brightnessScale, setBrightnessScale] = useState<Scale>('linear');
  const [brightnessType, setBrightnessType] = useState<'amount' | 'steps'>('amount');
  const [brightnessSteps, setBrightnessSteps] = useState(5);
  const [mixColor, setMixColor] = useState('#FA00A2');
  const [mixMode, setMixMode] = useState<colorUtil.MixMode>('rgb');
  const [mixPercentage, setMixPercentage] = useState(50);
  const [mixType, setMixType] = useState<'percentage' | 'steps'>('percentage');
  const [showOriginals, setShowOriginals] = useState(true);
  const [aperture, setAperture] = useState(0.5);
  const [mixScale, setMixScale] = useState<Scale>('linear');
  const [mixSteps, setMixSteps] = useState(5);

  useEffect(() => {
    setBaseColor(initialBaseColor);
  }, [initialBaseColor]);

  const applyScale = (ratio: number, scale: Scale) => {
    if (scale === 'log') {
      return Math.log(ratio * (Math.E - 1) + 1);
    }
    return ratio;
  };

  const brightnessResults = useMemo(() => {
    try {
      const operation = brightnessMode === 'lighten' ? colorUtil.lighten : colorUtil.darken;
      if (brightnessType === 'amount') {
        const ratio = brightnessPercentage / 100;
        const scaledRatio = applyScale(ratio, brightnessScale);
        return [{ color: operation(baseColor, scaledRatio) }];
      }
      // Steps mode
      const steps = colorUtil.generateBrightnessSteps(baseColor, brightnessSteps, operation, (r) => applyScale(r, brightnessScale));
      let results = steps.map((color, i) => ({ color, percentage: ((i + 1) / (brightnessSteps + 1)) * 100 }));
      if (showOriginals) {
        const targetColor = brightnessMode === 'lighten' ? '#FFFFFF' : '#000000';
        return [{ color: baseColor, percentage: 0 }, ...results, { color: targetColor, percentage: 100 }];
      }
      return results;
    } catch(e) {
      return [];
    }
  }, [baseColor, brightnessMode, brightnessPercentage, brightnessScale, brightnessType, brightnessSteps, showOriginals]);

  const mixResults = useMemo(() => {
    try {
      let results;
      if (mixType === 'steps') {
        results = colorUtil.generateSteps(baseColor, mixColor, mixSteps, (start, end, r) => {
          const scaledRatio = applyScale(r, mixScale);
          return colorUtil.mix(start, end, scaledRatio, mixMode, aperture);
        });
        if(showOriginals){
          return [baseColor, ...results, mixColor];
        }
      } else {
        const ratio = mixPercentage / 100;
        const scaledRatio = applyScale(ratio, mixScale);
        const mixedColor = colorUtil.mix(baseColor, mixColor, scaledRatio, mixMode, aperture);
        results = [mixedColor];
        if(showOriginals){
          return [baseColor, mixedColor, mixColor];
        }
      }
      return results;
    } catch(e) {
      return [];
    }
  }, [baseColor,mixColor,mixPercentage,mixMode,mixSteps,mixType,showOriginals,aperture,mixScale]);

  const minCardWidth = isMobile ? 296 : 316;

  const renderPalette = (colors: any[], isBrightnessSteps: boolean) => (
    <div
      className="grid gap-3"
      style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${minCardWidth}px, 1fr))` }}
    >
      {colors.map((item, index) => {
        const color = typeof item === 'string' ? item : item.color;
        const percentage = isBrightnessSteps ? item.percentage : undefined;
        return <ColorCard key={`${color}-${index}`} hexColor={color} percentage={percentage} />;
      })}
    </div>
  );

  const mixModeOptions = [
    { value: "rgb", label: "RGB" },
    { value: "hsl", label: "HSL" },
    { value: "hsv", label: "HSV" },
    { value: "lab", label: "LAB" },
    { value: "lch", label: "LCH" },
    { value: "log", label: t('logarithmic') },
    { value: "parabolic", label: t('parabolic') },
    { value: "quadratic", label: t('quadratic') },
  ];

  return (
    <div className="w-full mt-4 space-y-8">
      {activeTab === 'mix' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4 mb-6 items-end">
            <FloatingLabelInput label={t('firstColor')} value={baseColor} onValueChange={setBaseColor} type="text" />

            {mixType === 'percentage' ? (
              <div>
                <label htmlFor="cbms1" className="block text-sm font-medium text-muted-foreground mb-2">
                  {t('percentage')} ({100 - mixPercentage}% - {mixPercentage}%)
                </label>
                <CustomSlider
                  min={0}
                  max={100}
                  step={1}
                  value={mixPercentage}
                  onValueChange={setMixPercentage}
                />
              </div>
            ) : (
              <div>
                <label htmlFor="cbms2" className="block text-sm font-medium text-muted-foreground mb-2">
                  {t('steps')} ({mixSteps})
                </label>
                <CustomSlider
                  min={1}
                  max={25}
                  step={1}
                  value={mixSteps}
                  onValueChange={setMixSteps}
                />
              </div>
            )}

            <FloatingLabelInput label={t('secondColor')} value={mixColor} onValueChange={setMixColor} type="text" />

            <FloatingLabelCombobox label={t('mixMode')} value={mixMode} onValueChange={(value) => setMixMode(value as colorUtil.MixMode)} options={mixModeOptions} contentClassName="bg-black" />

            {mixMode === 'quadratic' && (
              <div className='lg:col-span-4'>
                <label htmlFor="cbms3" className="block text-sm font-medium text-muted-foreground mb-2">
                  Aperture ({aperture})
                </label>
                <CustomSlider
                  min={0}
                  max={1}
                  step={0.01}
                  value={aperture}
                  onValueChange={setAperture}
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <CustomCheckbox
                id="cbms4"
                direction={isRTL ? "rtl" : "ltr"}
                checked={mixType === 'steps'}
                onChange={(checked) => setMixType(checked ? 'steps' : 'percentage')}
                label={t('useSteps')}
                className="flex items-center space-x-2"
                key="custom-checkbox-mix-type"
              />
            </div>
            <div className="flex items-center space-x-2">
              <CustomCheckbox
                id="cbms5"
                direction={isRTL ? "rtl" : "ltr"}
                checked={showOriginals}
                onChange={(checked) => setShowOriginals(!!checked)}
                label={t('showOriginals')}
                className="flex items-center space-x-2"
                key="custom-checkbox-show-originals"
              />
            </div>
            <div>
              <Label htmlFor="cbms6" className="block text-sm font-medium text-muted-foreground mb-2">{t('scale')}</Label>
              <RadioGroup isRTL={isRTL} value={mixScale} onValueChange={(v) => setMixScale(v as Scale)} className="flex gap-8" id="cbms6">
                <CustomRadio
                  id="cbms7"
                  direction={isRTL ? "rtl" : "ltr"}
                  checked={mixScale === 'linear'}
                  onChange={() => setMixScale('linear')}
                  label={t('linear')}
                  className="flex items-center space-x-2"
                  key="custom-radio-mix-linear"
                />
                <CustomRadio
                  id="cbms8"
                  direction={isRTL ? "rtl" : "ltr"}
                  checked={mixScale === 'log'}
                  onChange={() => setMixScale('log')}
                  label={t('logarithmic')}
                  className="flex items-center space-x-2"
                  key="custom-radio-mix-log"
                />
              </RadioGroup>
            </div>
          </div>
          {renderPalette(mixResults, false)}
        </>
      )}

      {activeTab === 'brightness' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 mb-6 items-end">
            <FloatingLabelInput label={t('baseColor')} value={baseColor} onValueChange={setBaseColor} type="text" parentBackground="#111" />

            <div>
              <Label htmlFor="cbbs1" className="block text-sm font-medium text-muted-foreground mb-2">{t('mode')}</Label>
              <RadioGroup isRTL={isRTL} value={brightnessMode} onValueChange={(v) => setBrightnessMode(v as 'lighten' | 'darken')} className="flex gap-8" id="cbbs1">
                <CustomRadio
                  id="cbbs2"
                  direction={isRTL ? "rtl" : "ltr"}
                  checked={brightnessMode === 'lighten'}
                  onChange={() => setBrightnessMode('lighten')}
                  label={t('lighten')}
                  className="flex items-center space-x-2"
                  key="custom-radio-lighten"
                />
                <CustomRadio
                  id="cbbs3"
                  direction={isRTL ? "rtl" : "ltr"}
                  checked={brightnessMode === 'darken'}
                  onChange={() => setBrightnessMode('darken')}
                  label={t('darken')}
                  className="flex items-center space-x-2"
                  key="custom-radio-darken"
                />
              </RadioGroup>
            </div>

            {brightnessType === 'amount' ? (
              <div>
                <label htmlFor="cbbs4" className="block text-sm font-medium text-muted-foreground mb-2">
                  {t('amount')} ({brightnessPercentage.toFixed(1)}%)
                </label>
                <CustomSlider
                  min={0}
                  max={100}
                  step={0.1}
                  value={brightnessPercentage}
                  onValueChange={setBrightnessPercentage}
                />
              </div>
            ) : (
              <div>
                <label htmlFor="cbbs5" className="block text-sm font-medium text-muted-foreground mb-2">
                  {t('steps')} ({brightnessSteps})
                </label>
                <CustomSlider
                  min={1}
                  max={25}
                  step={1}
                  value={brightnessSteps}
                  onValueChange={setBrightnessSteps}
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <CustomCheckbox
                id="cbbs6"
                direction={isRTL ? "rtl" : "ltr"}
                checked={brightnessType === 'steps'}
                onChange={(checked) => setBrightnessType(checked ? 'steps' : 'amount')}
                label={t('useSteps')}
                className="flex items-center space-x-2"
                key="custom-checkbox-brightness-type"
              />
            </div>

            {brightnessType === 'steps' && (
              <div className="flex items-center space-x-2">
                <CustomCheckbox
                  id="cbbs7"
                  direction={isRTL ? "rtl" : "ltr"}
                  checked={showOriginals}
                  onChange={(checked) => setShowOriginals(!!checked)}
                  label={t('showOriginals')}
                  className="flex items-center space-x-2"
                  key="custom-checkbox-show-originals-brightness"
                />
              </div>
            )}

            <div>
              <Label htmlFor="cbbs8" className="block text-sm font-medium text-muted-foreground mb-2">{t('scale')}</Label>
              <RadioGroup isRTL={isRTL} value={brightnessScale} onValueChange={(v) => setBrightnessScale(v as Scale)} className="flex gap-8" id="cbbs8">
                <CustomRadio
                  id="cbbs9"
                  direction={isRTL ? "rtl" : "ltr"}
                  checked={brightnessScale === 'linear'}
                  onChange={() => setBrightnessScale('linear')}
                  label={t('linear')}
                  className="flex items-center space-x-2"
                  key="custom-radio-brightness-linear"
                />
                <CustomRadio
                  id="cbbs10"
                  direction={isRTL ? "rtl" : "ltr"}
                  checked={brightnessScale === 'log'}
                  onChange={() => setBrightnessScale('log')}
                  label={t('logarithmic')}
                  className="flex items-center space-x-2"
                  key="custom-radio-brightness-log"
                />
              </RadioGroup>
            </div>
          </div>

          {brightnessType === 'amount' && brightnessResults.length > 0 ? (
            <div className="w-full">
              <ColorCard hexColor={brightnessResults[0].color} />
            </div>
          ) : (
            renderPalette(brightnessResults, true)
          )}
        </>
      )}
    </div>
  );
}
