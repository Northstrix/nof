'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import useIsRTL from '@/hooks/use-is-rtl';

interface CustomSliderProps {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onValueChange: (value: number) => void;
  disabled?: boolean;
}

export function CustomSlider({
  min = 0,
  max = 100,
  step = 1,
  value,
  onValueChange,
  disabled = false,
}: CustomSliderProps) {
  const isRTL = useIsRTL();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const getPercentage = useCallback(() => {
    return ((value - min) / (max - min)) * 100;
  }, [value, min, max]);

  const handleInteraction = useCallback((clientX: number) => {
    if (disabled || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    let percentage;
    if (isRTL) {
      percentage = ((rect.right - clientX) / rect.width) * 100;
    } else {
      percentage = ((clientX - rect.left) / rect.width) * 100;
    }

    percentage = Math.max(0, Math.min(100, percentage));
    
    let newValue = min + (percentage / 100) * (max - min);
    
    if (step !== 0) {
      newValue = Math.round(newValue / step) * step;
    }

    newValue = Math.max(min, Math.min(max, newValue));

    onValueChange(newValue);
  }, [disabled, min, max, step, onValueChange, isRTL]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    setIsDragging(true);
    handleInteraction(e.clientX);
    sliderRef.current?.focus();
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      handleInteraction(e.clientX);
    }
  }, [isDragging, handleInteraction]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const direction = (e.key === 'ArrowRight' ? 1 : -1) * (isRTL ? -1 : 1);
        const newValue = Math.max(min, Math.min(max, value + direction * step));
        onValueChange(newValue);
    }
  };


  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const percentage = getPercentage();

  const thumbSize = 20;

  const sliderStyle: React.CSSProperties = {
    '--thumb-size': `${thumbSize}px`,
    '--track-height': '8px',
    '--primary-color': 'hsl(var(--primary))',
    '--secondary-color': 'hsl(var(--secondary))',
    '--thumb-color': 'hsl(var(--background))',
    '--thumb-border-color': isFocused ? 'hsl(var(--foreground))' : 'hsl(var(--primary))',
    '--disabled-opacity': '0.5',
  };

  const wrapperClasses = `custom-slider-wrapper ${disabled ? 'disabled' : ''}`;

  const thumbStyle: React.CSSProperties = {
    transform: `translateY(-50%)`,
  };
  
  if (isRTL) {
    thumbStyle.right = `calc(${percentage}% - var(--thumb-size) / 2)`;
  } else {
    thumbStyle.left = `calc(${percentage}% - var(--thumb-size) / 2)`;
  }

  return (
    <div style={sliderStyle}>
      <style>{`
        .custom-slider-wrapper {
          position: relative;
          width: 100%;
          height: var(--thumb-size);
          display: flex;
          align-items: center;
          cursor: pointer;
          touch-action: none;
          outline: none;
          border-radius: var(--track-height);
        }
        .custom-slider-wrapper.disabled {
          cursor: not-allowed;
          opacity: var(--disabled-opacity);
        }
        .slider-track, .slider-range {
          position: absolute;
          height: var(--track-height);
          border-radius: var(--track-height);
          top: 50%;
          transform: translateY(-50%);
          width: 100%;
        }
        .slider-track {
          background-color: var(--secondary-color);
        }
        .slider-range {
          background-color: var(--primary-color);
        }
        .slider-thumb {
          position: absolute;
          width: var(--thumb-size);
          height: var(--thumb-size);
          border-radius: 50%;
          background-color: var(--thumb-color);
          border: 2px solid var(--thumb-border-color);
          top: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: border-color 0.2s ease-in-out;
        }
      `}</style>
      <div
        ref={sliderRef}
        className={wrapperClasses}
        onMouseDown={handleMouseDown}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        tabIndex={disabled ? -1 : 0}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-disabled={disabled}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="slider-track" />
        <div className="slider-range" style={{ width: `${percentage}%` }} />
        <div 
          className="slider-thumb" 
          style={thumbStyle}
        />
      </div>
    </div>
  );
}
