"use client";
import React, { useState, useId } from "react";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";

export interface CustomCheckboxProps {
  id?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  direction?: "ltr" | "rtl";
  accentColor?: string;
  checkmarkColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderRadius?: number | string;
  borderWidth?: number | string;
  size?: number;
  labelColor?: string;
  labelFontSize?: number | string;
  labelFontWeight?: number | string;
  labelSpacing?: number;
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
  checkmarkDuration?: number;
  mirrorCheckmark?: boolean;
  checkedCoversOutline?: boolean;
  outlineTransition?: string;
  outlineHoverColor?: string;
  outlineHoverColorDisabled?: string;
  outlineColorDisabled?: string;
  borderStyle?: string;
  disabledBackgroundColor?: string;
  disabledBorderColor?: string;
  disabledCheckmarkColor?: string;
  options?: {
    value: string;
    label: React.ReactNode;
    id?: string;
    checkboxProps?: Partial<CustomCheckboxProps>;
  }[];
  values?: string[];
  onGroupChange?: (values: string[]) => void;
  maxSelected?: number;
  groupGap?: number;
  groupDirection?: "row" | "column";
}

const DEFAULTS = {
  accentColor: "hsl(var(--accent))",
  checkmarkColor: "hsl(var(--foreground))",
  backgroundColor: "hsl(var(--border))",
  borderColor: "var(--float-input-lbl-def-outline)",
  borderRadius: 10,
  borderWidth: 1,
  size: 24,
  labelColor: "hsl(var(--foreground))",
  labelFontSize: 14,
  labelFontWeight: 400,
  labelSpacing: 10,
  checkmarkDuration: 0.32,
  outlineTransition: "border-color 0.3s ease-in-out",
  outlineHoverColor: "#444",
  outlineHoverColorDisabled: "#444",
  outlineColorDisabled: undefined,
  borderStyle: "solid",
  disabledBackgroundColor: undefined,
  disabledBorderColor: undefined,
  disabledCheckmarkColor: undefined,
  groupGap: 18,
  groupDirection: "row" as "row" | "column",
};

const SingleCheckbox: React.FC<CustomCheckboxProps & { hovered?: boolean }> = ({
  id,
  checked = false,
  label,
  direction = "ltr",
  accentColor = DEFAULTS.accentColor,
  checkmarkColor = DEFAULTS.checkmarkColor,
  backgroundColor = DEFAULTS.backgroundColor,
  borderColor = DEFAULTS.borderColor,
  borderRadius = DEFAULTS.borderRadius,
  borderWidth = DEFAULTS.borderWidth,
  size = DEFAULTS.size,
  labelColor = DEFAULTS.labelColor,
  labelFontSize = DEFAULTS.labelFontSize,
  labelFontWeight = DEFAULTS.labelFontWeight,
  labelSpacing = DEFAULTS.labelSpacing,
  disabled = false,
  checkmarkDuration = DEFAULTS.checkmarkDuration,
  mirrorCheckmark = false,
  checkedCoversOutline = true,
  outlineTransition = DEFAULTS.outlineTransition,
  outlineHoverColor = DEFAULTS.outlineHoverColor,
  outlineHoverColorDisabled = DEFAULTS.outlineHoverColorDisabled,
  outlineColorDisabled = DEFAULTS.outlineColorDisabled,
  borderStyle = DEFAULTS.borderStyle,
  disabledBackgroundColor,
  disabledBorderColor,
  disabledCheckmarkColor,
  hovered = false,
}) => {
  const flexDirection = direction === "rtl" ? "row-reverse" : "row";

  const resolvedDisabledBackgroundColor = disabledBackgroundColor ?? backgroundColor;
  const resolvedDisabledBorderColor = disabledBorderColor ?? borderColor;
  const resolvedDisabledCheckmarkColor = disabledCheckmarkColor ?? checkmarkColor;
  const resolvedOutlineColorDisabled = outlineColorDisabled ?? resolvedDisabledBorderColor;

  let borderCol: string;
  if (disabled) {
    borderCol = hovered ? (outlineHoverColorDisabled ?? outlineHoverColor) : resolvedOutlineColorDisabled;
  } else {
    borderCol = checkedCoversOutline
      ? checked
        ? accentColor
        : hovered
        ? outlineHoverColor
        : borderColor
      : hovered
      ? outlineHoverColor
      : borderColor;
  }

  const border = borderWidth === 0 ? "none" : `${borderWidth}px ${borderStyle} ${borderCol}`;
  const boxBg = disabled
    ? resolvedDisabledBackgroundColor
    : checked
    ? checkedCoversOutline
      ? accentColor
      : `linear-gradient(${accentColor} 0 0) padding-box, ${backgroundColor} border-box`
    : backgroundColor;

  const checkboxEl = (
    <span
      key={`${id}-box`}
      id={id}
      style={{
        width: size,
        height: size,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: boxBg,
        border,
        borderRadius: typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius,
        transition: `background 0.18s, ${outlineTransition}`,
        position: "relative",
        boxSizing: "border-box",
        flexShrink: 0,
        outline: "none",
        pointerEvents: "none",
      }}
      tabIndex={-1}
      role="presentation"
      aria-hidden="true"
    >
      <motion.svg
        key={`${id}-svg`}
        width={size * 0.75}
        height={size * 0.75}
        viewBox="0 0 24 24"
        stroke={disabled ? resolvedDisabledCheckmarkColor : checkmarkColor}
        strokeWidth={3}
        fill="none"
        style={{
          display: "block",
          pointerEvents: "none",
          transform: mirrorCheckmark ? "scaleX(-1)" : "none",
        }}
      >
        <motion.path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 13l4 4L19 7"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={checked ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: checkmarkDuration, ease: [0.4, 0, 0.2, 1] }}
        />
      </motion.svg>
      {hovered && (
        <span
          key={`${id}-hover`}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius,
            background: "rgba(24,24,27,0.18)",
            pointerEvents: "none",
            zIndex: 2,
          }}
        />
      )}
    </span>
  );

  const labelEl = label && (
    <span
      key={`${id}-label`}
      style={{
        color: labelColor,
        fontSize: labelFontSize,
        fontWeight: labelFontWeight,
        lineHeight: 1.5,
        whiteSpace: "pre-line",
        direction,
        textAlign: direction === "rtl" ? "right" : "left",
        cursor: disabled ? "not-allowed" : "pointer",
        userSelect: "text",
        pointerEvents: "none",
      }}
      aria-hidden="true"
    >
      {label}
    </span>
  );

  const children = direction === "rtl" ? [labelEl, checkboxEl] : [checkboxEl, labelEl];

  return (
    <span
      dir={direction}
      style={{
        display: "inline-flex",
        alignItems: "center",
        flexDirection,
        gap: labelSpacing,
        cursor: disabled ? "not-allowed" : "pointer",
        userSelect: "text",
        opacity: disabled ? 0.5 : 1,
        position: "relative",
      }}
      tabIndex={-1}
      role="presentation"
      aria-hidden="true"
    >
      {children.filter(Boolean)}
    </span>
  );
};

const CustomCheckbox: React.FC<CustomCheckboxProps> = (props) => {
  // GROUP MODE
  if (props.options && props.values && props.onGroupChange) {
    const {
      options,
      values,
      onGroupChange,
      direction = "ltr",
      maxSelected,
      groupGap = DEFAULTS.groupGap,
      groupDirection = DEFAULTS.groupDirection,
    } = props;

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const isVertical = groupDirection === "column";
    const isRTL = direction === "rtl";
    const groupAlignItems = isVertical && isRTL ? "flex-end" : "flex-start";

    return (
      <div
        style={{
          display: "flex",
          flexDirection: groupDirection,
          gap: groupGap,
          alignItems: groupAlignItems,
        }}
      >
        {options.map((opt, idx) => {
          const isChecked = values.includes(opt.value);
          const isDisabled =
            !!opt.checkboxProps?.disabled ||
            (!isChecked && typeof maxSelected === "number" && values.length >= maxSelected);
          const uniqueId = opt.id || uuidv4();

          return (
            <label
              key={uniqueId}
              htmlFor={uniqueId}
              dir={direction}
              style={{
                display: "inline-flex",
                alignItems: "center",
                flexDirection: direction === "rtl" ? "row-reverse" : "row",
                gap: opt.checkboxProps?.labelSpacing ?? DEFAULTS.labelSpacing,
                cursor: isDisabled ? "not-allowed" : "pointer",
                userSelect: "text",
                opacity: isDisabled ? 0.5 : 1,
                position: "relative",
              }}
              tabIndex={isDisabled ? -1 : 0}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={(e) => {
                if (!isDisabled) {
                  e.preventDefault();
                  if (isChecked) onGroupChange(values.filter((v) => v !== opt.value));
                  else onGroupChange([...values, opt.value]);
                }
              }}
              onKeyDown={(e) => {
                if ((e.key === " " || e.key === "Enter") && !isDisabled) {
                  e.preventDefault();
                  if (isChecked) onGroupChange(values.filter((v) => v !== opt.value));
                  else onGroupChange([...values, opt.value]);
                }
              }}
              role="checkbox"
              aria-checked={isChecked}
              aria-disabled={isDisabled}
            >
              <SingleCheckbox
                {...opt.checkboxProps}
                id={uniqueId}
                checked={isChecked}
                disabled={isDisabled}
                direction={direction}
                label={opt.label}
                hovered={hoveredIndex === idx}
              />
            </label>
          );
        })}
      </div>
    );
  }

  // SINGLE MODE
  const [hovered, setHovered] = useState(false);
  const generatedId = useId();
  const id = props.id || generatedId || uuidv4();

  return (
    <label
      htmlFor={id}
      dir={props.direction ?? "ltr"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        flexDirection: props.direction === "rtl" ? "row-reverse" : "row",
        gap: props.labelSpacing ?? DEFAULTS.labelSpacing,
        cursor: props.disabled ? "not-allowed" : "pointer",
        userSelect: "text",
        opacity: props.disabled ? 0.5 : 1,
        position: "relative",
        ...props.style,
      }}
      className={props.className}
      tabIndex={props.disabled ? -1 : 0}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => {
        if (!props.disabled && props.onChange) {
          e.preventDefault();
          props.onChange(!props.checked);
        }
      }}
      onKeyDown={(e) => {
        if ((e.key === " " || e.key === "Enter") && !props.disabled && props.onChange) {
          e.preventDefault();
          props.onChange(!props.checked);
        }
      }}
      role="checkbox"
      aria-checked={props.checked}
      aria-disabled={props.disabled}
    >
      <SingleCheckbox {...props} id={id} hovered={hovered} />
    </label>
  );
};

export default CustomCheckbox;
