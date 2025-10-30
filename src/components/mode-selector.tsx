'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import useIsRTL from '@/hooks/use-is-rtl';

interface ModeSelectorOption {
  label: string;
  value: string;
}

interface ModeSelectorProps {
  options: ModeSelectorOption[];
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  options,
  value,
  onValueChange,
  className,
}) => {
  const isRTL = useIsRTL();
  return (
    <div className={cn("bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg p-4 w-full md:w-auto", className)}>
        <div className="w-full bg-[#111] rounded-md p-2 flex flex-col gap-1">
            {options.map((option) => (
                <button
                    key={option.value}
                    onClick={() => onValueChange(option.value)}
                    className={cn(
                        'w-full px-3 py-1.5 rounded-md transition-colors text-sm',
                        isRTL ? 'text-right' : 'text-left',
                        value === option.value
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    )}
                >
                    {option.label}
                </button>
            ))}
      </div>
    </div>
  );
};
