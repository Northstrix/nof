'use client';
import type { PopoverContentProps } from '@radix-ui/react-popover';
import {
  type HexColor,
  hexToHsva,
  type HslaColor,
  hslaToHsva,
  type HsvaColor,
  hsvaToHex,
  hsvaToHsla,
  hsvaToHslString,
  hsvaToRgba,
  type RgbaColor,
  rgbaToHsva,
} from '@uiw/color-convert';
import Hue from '@uiw/react-color-hue';
import Saturation from '@uiw/react-color-saturation';
import { CheckIcon, ChevronDownIcon, XIcon } from 'lucide-react';
import React from 'react';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import useIsRTL from '@/hooks/use-is-rtl';
import { useTranslation } from '@/hooks/use-translation';

function getColorAsHsva(
  color: `#${string}` | HsvaColor | HslaColor | RgbaColor
): HsvaColor {
  if (typeof color === 'string') {
    try {
      return hexToHsva(color);
    } catch (e) {
      return { h: 0, s: 0, v: 0, a: 1 };
    }
  } else if ('h' in color && 's' in color && 'v' in color) {
    return color;
  } else if ('r' in color) {
    return rgbaToHsva(color);
  } else {
    return hslaToHsva(color);
  }
}

export type ColorPickerValue = HsvaColor;
export type ColorPickerProps = {
  value?: `#${string}` | HsvaColor | HslaColor | RgbaColor;
  type?: 'hsl' | 'rgb' | 'hex';
  swatches?: HexColor[];
  hideContrastRatio?: boolean;
  hideDefaultSwatches?: boolean;
  className?: string;
  onValueChange?: (value: ColorPickerValue) => void;
} & Omit<PopoverContentProps, 'onValueChange'>;

export function ColorPicker({
  value,
  type = 'hex',
  swatches = [],
  hideContrastRatio,
  hideDefaultSwatches,
  onValueChange,
  className,
  ...props
}: ColorPickerProps) {
  const [colorType, setColorType] = React.useState(type);
  const [colorHsv, setColorHsv] = React.useState<HsvaColor>(
    value ? getColorAsHsva(value) : { h: 0, s: 0, v: 0, a: 1 }
  );
  React.useEffect(() => {
    if (value) {
      const newHsv = getColorAsHsva(value);
      if (
        newHsv.h !== colorHsv.h ||
        newHsv.s !== colorHsv.s ||
        newHsv.v !== colorHsv.v ||
        newHsv.a !== colorHsv.a
      ) {
        setColorHsv(newHsv);
      }
    }
  }, [value, colorHsv.h, colorHsv.s, colorHsv.v, colorHsv.a]);

  const [isInputInvalid, setIsInputInvalid] = React.useState(false);

  const handleValueChange = (newColor: HsvaColor) => {
    setColorHsv(newColor);
    onValueChange?.(newColor);
    setIsInputInvalid(false);
  };

  const displayColor = isInputInvalid ? { h: 0, s: 0, v: 0, a: 1 } : colorHsv;

  return (
    <div
      className={cn('w-full max-w-[348px] space-y-4 rounded-lg border border-border bg-black p-4', className)}
      style={
        {
          '--selected-color': hsvaToHslString(displayColor),
        } as React.CSSProperties
      }
    >
      <Saturation
        hsva={colorHsv}
        onChange={(newColor) => {
          handleValueChange({ ...colorHsv, ...newColor });
        }}
        style={{
          width: '100%',
          height: 'auto',
          aspectRatio: '2/1',
          borderRadius: 'var(--radius)',
        }}
        className="border border-border"
      />
      <Hue
        hue={colorHsv.h}
        onChange={(newHue) => {
          handleValueChange({ ...colorHsv, ...newHue });
        }}
        className="[&>div:first-child]:overflow-hidden [&>div:first-child]:!rounded-md"
        style={
          {
            width: '100%',
            height: '0.9rem',
            borderRadius: 'var(--radius)',
            '--alpha-pointer-background-color': 'hsl(var(--foreground))',
          } as React.CSSProperties
        }
      />
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="shrink-0 justify-between uppercase">
              {colorType}
              <ChevronDownIcon
                className="-me-1 ms-2 opacity-60"
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem
              checked={colorType === 'hex'}
              onCheckedChange={() => setColorType('hex')}
            >
              HEX
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={colorType === 'hsl'}
              onCheckedChange={() => setColorType('hsl')}
            >
              HSL
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={colorType === 'rgb'}
              onCheckedChange={() => setColorType('rgb')}
            >
              RGB
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex grow">
          {colorType === 'hsl' && (
            <ObjectColorInput
              color={hsvaToHsla(colorHsv)}
              onChange={(newColor) => handleValueChange(hslaToHsva(newColor))}
              onInvalid={setIsInputInvalid}
            />
          )}
          {colorType === 'rgb' && (
            <ObjectColorInput
              color={hsvaToRgba(colorHsv)}
              onChange={(newColor) => handleValueChange(rgbaToHsva(newColor))}
              onInvalid={setIsInputInvalid}
            />
          )}
          {colorType === 'hex' && (
            <HexColorInput
              color={hsvaToHex(colorHsv)}
              onChange={handleValueChange}
              onInvalid={setIsInputInvalid}
            />
          )}
        </div>
      </div>
      {!hideDefaultSwatches && (
        <>
          <Separator />
          <div className="flex flex-wrap justify-start gap-2">
            {[
              '#00A2FA',
              '#A020F0',
              '#2CADF6',
              '#6366F1',
              '#D946EF',
              '#F97316',
              '#FBBF24',
              '#A3E635',
              '#22C55E',
              '#EF4444',
              ...swatches,
            ]
              .filter((c, i, a) => a.indexOf(c) === i)
              .map((color) => (
                <button
                  type="button"
                  key={`${color}-swatch`}
                  style={
                    {
                      '--swatch-color': color,
                    } as React.CSSProperties
                  }
                  onClick={() => handleValueChange(hexToHsva(color))}
                  onKeyUp={(e) =>
                    e.key === 'Enter' ? handleValueChange(hexToHsva(color)) : null
                  }
                  aria-label={`Set color to ${color}`}
                  className="size-6 cursor-pointer rounded-md border border-[#242424] bg-[var(--swatch-color)] ring-offset-background transition-all duration-300 ease-in-out hover:border-[#323232] focus-visible:border-[#323232] focus-visible:outline-none"
                />
              ))}
          </div>
        </>
      )}
      {!hideContrastRatio && (
        <>
          <Separator />
          <ContrastRatioInfo color={displayColor} />
        </>
      )}
    </div>
  );
}

type ContrastRatioProps = {
  color: HsvaColor;
};

export function ContrastRatioInfo({ color }: ContrastRatioProps) {
  const [darkModeContrastRatio, setDarkModeContrastValue] = React.useState(0);
  const { t } = useTranslation();

  React.useEffect(() => {
    const rgb = hsvaToRgba(color);
    const toSRGB = (c: number) => {
      const channel = c / 255;
      return channel <= 0.03928
        ? channel / 12.92
        : ((channel + 0.055) / 1.055) ** 2.4;
    };
    const r = toSRGB(rgb.r);
    const g = toSRGB(rgb.g);
    const b = toSRGB(rgb.b);
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    const blackLum = 0;
    const ratio = (Math.max(luminance, blackLum) + 0.05) / (Math.min(luminance, blackLum) + 0.05);
    setDarkModeContrastValue(Number(ratio.toFixed(2)));
  }, [color]);

  const ValidationBadge = ({
    ratio,
    ratioLimit,
    className,
    children,
    ...props
  }: {
    ratio: number;
    ratioLimit: number;
  } & Omit<BadgeProps, 'variant'>) => (
    <Badge
      variant="outline"
      className={cn(
        'gap-1.5 rounded-full text-muted-foreground',
        ratio >= ratioLimit &&
          'border-transparent bg-primary/20 text-primary',
        className
      )}
      {...props}
    >
      {ratio >= ratioLimit ? <CheckIcon size={14} /> : <XIcon size={14} />}
      {children}
    </Badge>
  );

  return (
    <div className="flex items-center gap-4">
      <div 
        className="flex size-10 items-center justify-center rounded-lg"
        style={{
            backgroundColor: hsvaToHex(color), 
        }}
      >
        <span className="font-medium text-white">A</span>
      </div>
      <div className="flex-grow">
          <span className="text-sm font-medium text-muted-foreground">{t('contrastRatio')}</span>
          <div className="flex items-center justify-between">
              <span className="text-sm font-mono">{darkModeContrastRatio}</span>
              <div className="flex items-center gap-1">
                <ValidationBadge ratio={darkModeContrastRatio} ratioLimit={4.5}>
                  AA
                </ValidationBadge>
                <ValidationBadge ratio={darkModeContrastRatio} ratioLimit={7}>
                  AAA
                </ValidationBadge>
              </div>
          </div>
      </div>
    </div>
  );
}

function HexColorInput({
  color,
  onChange,
  onInvalid,
}: {
  color: HexColor;
  onChange: (color: HsvaColor) => void;
  onInvalid: (isInvalid: boolean) => void;
}) {
  const [inputValue, setInputValue] = React.useState(color);
  const [isFocused, setIsFocused] = React.useState(false);

  React.useEffect(() => {
    if (!isFocused) {
      setInputValue(color);
    }
  }, [color, isFocused]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHex = e.target.value;
    setInputValue(newHex);
    const hexRegex = /^#([0-9A-Fa-f]{6})$/i;
    const isValid = hexRegex.test(newHex);
    onInvalid(!isValid);
    if (isValid) {
      try {
        const newColor = hexToHsva(newHex as HexColor);
        onChange(newColor);
      } catch (error) {
        onInvalid(true);
      }
    }
  };

  const isInvalid = !/^#([0-9A-Fa-f]{6})$/i.test(inputValue) && isFocused;

  return (
    <Input
      className={cn(
        'flex uppercase',
        isInvalid && 'border-red-500 focus-visible:ring-red-500'
      )}
      value={inputValue.toUpperCase()}
      style={{ direction: 'ltr' }}
      onChange={handleInputChange}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    />
  );
}

type ObjectColorInputProps = {
  color: RgbaColor | HslaColor;
  onChange: (color: RgbaColor | HslaColor) => void;
  onInvalid: (isInvalid: boolean) => void;
};

function ObjectColorInput({
  color,
  onChange,
  onInvalid,
}: ObjectColorInputProps) {
  const isRtl = useIsRTL();
  const colorType = 'r' in color ? 'rgb' : 'hsl';
  const keys = colorType === 'rgb' ? ['r', 'g', 'b'] : ['h', 's', 'l'];
  const [inputValues, setInputValues] = React.useState(() =>
    Object.fromEntries(keys.map((key) => [key, String((color as any)[key])]))
  );
  const [isFocused, setIsFocused] = React.useState<string | null>(null);

  React.useEffect(() => {
    const activeKey = isFocused;
    const newValues: { [key: string]: string } = {};
    let changed = false;
    for (const key of keys) {
      const externalValue = String(Math.round((color as any)[key]));
      if (key !== activeKey && inputValues[key] !== externalValue) {
        newValues[key] = externalValue;
        changed = true;
      } else {
        newValues[key] = inputValues[key];
      }
    }
    if (changed) {
      setInputValues(newValues);
    }
  }, [color, keys, isFocused, inputValues]);

  const validate = (key: string, value: number) => {
    if (isNaN(value)) return false;
    if (key === 'h') return value >= 0 && value <= 360;
    if (key === 's' || key === 'l') return value >= 0 && value <= 100;
    if (key === 'r' || key === 'g' || key === 'b') return value >= 0 && value <= 255;
    return true;
  };

  const handleInputChange = (key: string, value: string) => {
    const newStringValues = { ...inputValues, [key]: value };
    setInputValues(newStringValues);
    const allValid = keys.every((k) => {
      const numVal = Number(newStringValues[k]);
      return (
        newStringValues[k].trim() !== '' &&
        !isNaN(numVal) &&
        validate(k, numVal)
      );
    });
    onInvalid(!allValid);
    if (allValid) {
      const updatedColor: any = {};
      for (const k of keys) {
        updatedColor[k] = Number(newStringValues[k]);
      }
      if ('a' in color) {
        updatedColor.a = color.a;
      }
      onChange(updatedColor as any);
    }
  };

  const inputStyle: React.CSSProperties = { direction: 'ltr', textAlign: 'left' };

  return (
    <div className="-mt-px flex">
      {keys.map((key, index) => {
        const numValue = Number(inputValues[key]);
        const isInvalid =
          isFocused === key &&
          (inputValues[key].trim() === '' ||
            isNaN(numValue) ||
            !validate(key, numValue));
        return (
          <div key={key} className="relative min-w-0 flex-1 focus-within:z-10">
            <Input
              className={cn(
                'peer shadow-none',
                index > 0 && '-ms-px',
                index === 0 && (isRtl ? 'rounded-s-none' : 'rounded-e-none'),
                index === keys.length - 1 &&
                  (isRtl ? 'rounded-e-none' : 'rounded-s-none'),
                index > 0 && index < keys.length - 1 && 'rounded-none',
                isInvalid && 'border-red-500 focus-visible:ring-red-500'
              )}
              style={inputStyle}
              value={inputValues[key]}
              onChange={(e) => handleInputChange(key, e.target.value)}
              onFocus={() => setIsFocused(key)}
              onBlur={() => setIsFocused(null)}
            />
          </div>
        );
      })}
    </div>
  );
}
