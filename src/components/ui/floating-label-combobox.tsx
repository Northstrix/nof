'use client';
import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { FloatingLabelInput } from './floating-label-input';
import useIsRTL from '@/hooks/use-is-rtl';
import { cn } from '@/lib/utils';
import { ChevronsUpDown } from 'lucide-react';
import { ModeSelector } from '../mode-selector';

interface FloatingLabelComboboxProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
  accentColor?: string;
  parentBackground?: string;
  inputOutlineColor?: string;
  inputFocusOutlineColor?: string;
  outlineWidth?: string;
  foregroundColor?: string;
  mutedForegroundColor?: string;
  rounding?: string;
  inputPadding?: string;
  inputFontSize?: string;
  labelFontSize?: string;
  labelActiveFontSize?: string;
  labelPadding?: string;
  labelActivePadding?: string;
  inputHeight?: string;
  className?: string;
  contentClassName?: string;
}

export const FloatingLabelCombobox: React.FC<FloatingLabelComboboxProps> = ({
  label,
  value,
  onValueChange,
  options,
  contentClassName,
  ...rest
}) => {
  const [open, setOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isRTL = useIsRTL();
  const selectedOption = options.find((option) => option.value === value);

  const handleValueChange = (newValue: string) => {
    onValueChange(newValue);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setOpen(prev => !prev);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div 
          className="relative cursor-pointer focus:outline-none"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <FloatingLabelInput
            label={label}
            value={selectedOption ? selectedOption.label : ''}
            onValueChange={() => {}}
            isCombobox
            focused={open || isFocused}
            readOnly
            inputClassName={isRTL ? 'text-right' : 'text-left'}
            {...rest}
          />
          <ChevronsUpDown 
            className="h-4 w-4 absolute top-1/2 -translate-y-1/2 text-muted-foreground" 
            style={{ [isRTL ? 'left' : 'right']: '12px' }}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className={cn("w-[--radix-popover-trigger-width] p-0 border-0", contentClassName)} align="start">
           <ModeSelector
              options={options}
              value={value}
              onValueChange={handleValueChange}
              className='bg-black'
            />
      </PopoverContent>
    </Popover>
  );
};
