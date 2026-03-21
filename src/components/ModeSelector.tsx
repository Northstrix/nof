'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/use-translation';

interface ModeSelectorOption {
  label: string;
  value: string;
}

interface ModeSelectorProps {
  options: ModeSelectorOption[];
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  isHeightFixed?: boolean;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  options,
  value,
  onValueChange,
  className,
  isHeightFixed = false,
}) => {
  const { isRtl } = useTranslation();

  return (
    <div
      className={cn(
        "bg-[hsl(var(--background))] border border-[var(--border-color)] p-4 w-full flex flex-col gap-2", // added gap-2
        isHeightFixed ? "justify-center" : "h-auto",
        className
      )}
      style={{
        height: isHeightFixed ? 334 : 'auto',
        borderRadius: 'var(--radius)', // use global radius variable
      }}
    >
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onValueChange(option.value)}
          className={cn(
            'w-full px-3 py-2 transition-all text-xs tracking-wider shrink-0',
            isRtl ? 'text-right font-semibold' : 'text-left font-black',
            value === option.value
              ? 'bg-primary text-black'
              : 'text-white/40 hover:bg-white/10 hover:text-white'
          )}
          style={{
            borderRadius: 'var(--radius)',
          }}
        >

          {option.label}
        </button>
      ))}
    </div>
  );
};
