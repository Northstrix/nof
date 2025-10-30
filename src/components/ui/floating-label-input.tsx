'use client';
import React, { useState, useCallback } from 'react';
import useIsRTL from '@/hooks/use-is-rtl';
import { cn } from '@/lib/utils';

export interface FloatingLabelInputProps {
  label: string;
  value: string;
  onValueChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  disabled?: boolean;
  textarea?: boolean;
  accentColor?: string;
  textareaHeight?: string;
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
  inputClassName?: string;
  isCombobox?: boolean;
  focused?: boolean;
  readOnly?: boolean;
}

function detectLabelDir(text: string): 'rtl' | 'ltr' {
  return /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/.test(text) ? 'rtl' : 'ltr';
}

export const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  label,
  value,
  onValueChange,
  type = 'text',
  autoComplete = 'off',
  required = false,
  disabled = false,
  textarea = false,
  accentColor = 'hsl(var(--primary))',
  textareaHeight = '152px',
  parentBackground = '#111',
  inputOutlineColor = 'var(--float-input-lbl-def-outline)',
  inputFocusOutlineColor = 'hsl(var(--foreground))',
  outlineWidth = '1px',
  foregroundColor = 'hsl(var(--foreground))',
  mutedForegroundColor = 'var(--float-input-lbl-muted-foreground)',
  rounding = 'var(--radius)',
  inputPadding = '17px',
  inputFontSize = '1rem',
  labelFontSize = '1rem',
  labelActiveFontSize = '12px',
  labelPadding = '0 7px',
  labelActivePadding = '0 6px',
  inputHeight = '49px',
  className,
  inputClassName,
  isCombobox = false,
  focused: focusedProp,
  readOnly = false,
}) => {
  const [internalFocused, setInternalFocused] = useState(false);
  const isRTL = useIsRTL();
  
  const focused = focusedProp !== undefined ? focusedProp : internalFocused;

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (readOnly) return;
      onValueChange(e.target.value);
    },
    [onValueChange, readOnly]
  );

  const handleFocus = useCallback(() => setInternalFocused(true), []);
  const handleBlur = useCallback(() => setInternalFocused(false), []);

  const hasValue = value.length > 0;
  const labelDir = detectLabelDir(label);

  const style: React.CSSProperties = {
    '--accent-color': accentColor,
    '--mobile-form-input-bg': parentBackground,
    '--input-outline': inputOutlineColor,
    '--input-outline-focus': inputFocusOutlineColor,
    '--input-outline-width': outlineWidth,
    '--foreground': foregroundColor,
    '--muted-foreground': mutedForegroundColor,
    '--parent-background': parentBackground,
    '--general-rounding': rounding,
    '--floating-input-layout-text-area-height': textareaHeight,
    '--input-padding': inputPadding,
    '--input-font-size': inputFontSize,
    '--label-font-size': labelFontSize,
    '--label-active-font-size': labelActiveFontSize,
    '--label-padding': labelPadding,
    '--label-active-padding': labelActivePadding,
    '--input-height': inputHeight,
  } as React.CSSProperties;
  
  const isColorInput = !isCombobox;

  const inputStyle: React.CSSProperties = {
    textAlign: isColorInput ? 'left' : (isRTL ? 'right' : 'left'),
    direction: isColorInput ? 'ltr' : (isRTL ? 'rtl' : 'ltr'),
    caretColor: isCombobox || readOnly ? 'transparent' : undefined,
  };


  return (
    <div
      className={[
        'mobile-form-group',
        isRTL ? 'rtl' : '',
        focused ? 'active' : '',
        hasValue ? 'has-value' : '',
        textarea ? 'textarea' : '',
        className,
      ].join(' ')}
      style={style}
    >
      {textarea ? (
        <textarea
          className={cn("mobile-form-input", inputClassName)}
          required={required}
          value={value}
          onChange={handleInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoComplete={autoComplete}
          disabled={disabled}
          readOnly={readOnly}
          style={inputStyle}
          spellCheck={false}
        />
      ) : (
        <input
          className={cn("mobile-form-input", inputClassName)}
          type={type}
          required={required}
          value={value}
          onChange={handleInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoComplete={autoComplete}
          disabled={disabled}
          readOnly={readOnly}
          style={inputStyle}
          spellCheck={false}
        />
      )}
      <label
        className={'mobile-form-label' + (textarea ? ' label-textarea' : '')}
        dir={labelDir}
      >
        {label}
      </label>
      <style jsx>{`
        .mobile-form-group {
          position: relative;
          width: 100%;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .mobile-form-input {
          width: 100%;
          height: var(--input-height);
          padding: var(--input-padding);
          font-size: var(--input-font-size);
          font-weight: 400;
          color: var(--foreground);
          background: transparent;
          border: var(--input-outline-width) solid var(--input-outline);
          border-radius: var(--general-rounding);
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.3s, color 0.3s, background 0.3s;
          resize: none;
          line-height: 1.4;
          cursor: ${isCombobox || readOnly ? 'pointer' : 'text'};
        }
        .mobile-form-group.active .mobile-form-input {
            border-color: var(--input-outline-focus);
        }
        .mobile-form-input:disabled {
          opacity: 0.5;
          pointer-events: none;
        }
        .mobile-form-group.textarea .mobile-form-input {
          height: var(--floating-input-layout-text-area-height);
          overflow-y: auto;
        }
        .mobile-form-label {
          position: absolute;
          left: 11px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--muted-foreground);
          font-size: var(--label-font-size);
          font-weight: 400;
          pointer-events: none;
          background: var(--parent-background);
          padding: var(--label-padding);
          transition: color 0.3s, background 0.3s, font-size 0.3s, top 0.3s,
            transform 0.3s;
          z-index: 2;
          max-width: calc(100% - 26px);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .mobile-form-group.rtl .mobile-form-label {
          right: 12px;
          left: auto;
        }
        .mobile-form-group.active .mobile-form-label,
        .mobile-form-group.has-value .mobile-form-label {
          top: 0;
          font-size: var(--label-active-font-size);
          padding: var(--label-active-padding);
          z-index: 2;
        }

        .mobile-form-group.active .mobile-form-label {
            color: var(--accent-color);
        }

        .mobile-form-group.has-value:not(.active) .mobile-form-label {
             color: var(--muted-foreground);
        }
        
        /* Textarea label placement */
        .mobile-form-group.textarea:not(.active):not(.has-value)
          .mobile-form-label {
          top: 12px;
          transform: none;
        }
      `}</style>
    </div>
  );
};
