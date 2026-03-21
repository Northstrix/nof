"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

export interface CustomCheckboxProps {
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
  // Group
  options?: {
    value: string;
    label: React.ReactNode;
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
  backgroundColor: "#262626",
  borderColor: "#2d2d2d",
  borderRadius: "var(--radius)",
  borderWidth: 1.5,
  size: 24,
  // ≈ text-xs text-white/40
  labelColor: "rgba(255,255,255,0.4)",
  labelColorHover: "rgba(255,255,255,0.6)",
  labelFontSize: 12,
  labelFontWeight: 900,
  labelSpacing: 8,
  checkmarkDuration: 0.32,
  outlineTransition: "border-color 0.2s ease",
  outlineHoverColor: "#363636",
  outlineHoverColorDisabled: "#1a1a1a",
  outlineColorDisabled: undefined,
  borderStyle: "solid",
  disabledBackgroundColor: undefined,
  disabledBorderColor: undefined,
  disabledCheckmarkColor: undefined,
  groupGap: 18,
  groupDirection: "row" as "row" | "column",
};

const SingleCheckbox: React.FC<CustomCheckboxProps & { hovered?: boolean }> = ({
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

  const resolvedDisabledBackgroundColor =
    disabledBackgroundColor ?? backgroundColor;
  const resolvedDisabledBorderColor = disabledBorderColor ?? "#242424";
  const resolvedDisabledCheckmarkColor =
    disabledCheckmarkColor ?? checkmarkColor;
  const resolvedOutlineColorDisabled =
    outlineColorDisabled ?? resolvedDisabledBorderColor;

  let borderCol: string;
  if (disabled) {
    borderCol = hovered
      ? outlineHoverColorDisabled ?? outlineHoverColor
      : resolvedOutlineColorDisabled;
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

  const border =
    borderWidth === 0 ? "none" : `${borderWidth}px ${borderStyle} ${borderCol}`;

  const boxBg = disabled
    ? resolvedDisabledBackgroundColor
    : checked
    ? checkedCoversOutline
      ? accentColor
      : `linear-gradient(${accentColor} 0 0) padding-box, ${backgroundColor} border-box`
    : backgroundColor;

  const effectiveLabelColor =
    hovered && !disabled ? DEFAULTS.labelColorHover : labelColor;

  const checkboxNode = (
    <span
      style={{
        width: size,
        height: size,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: boxBg,
        border,
        borderRadius:
          typeof borderRadius === "number"
            ? `${borderRadius}px`
            : borderRadius,
        transition: `background 0.18s, ${outlineTransition}`,
        position: "relative",
        boxSizing: "border-box",
        flexShrink: 0,
        outline: "none",
        pointerEvents: "none",
      }}
    >
      <motion.svg
        width={size * 0.75}
        height={size * 0.75}
        viewBox="0 0 24 24"
        stroke={
          disabled ? resolvedDisabledCheckmarkColor : checkmarkColor
        }
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
          animate={
            checked
              ? { pathLength: 1, opacity: 1 }
              : { pathLength: 0, opacity: 0 }
          }
          transition={{
            duration: checkmarkDuration,
            ease: [0.4, 0, 0.2, 1],
          }}
        />
      </motion.svg>
    </span>
  );

  const labelNode =
    label && (
      <span
        style={{
          color: effectiveLabelColor,
          fontSize: labelFontSize,
          fontWeight: labelFontWeight,
          lineHeight: 1.5,
          whiteSpace: "pre-line",
          direction,
          textAlign: direction === "rtl" ? "right" : "left",
          cursor: disabled ? "not-allowed" : "pointer",
          userSelect: "none",
          pointerEvents: "none",
          transition: "color 0.2s ease",
        }}
      >
        {label}
      </span>
    );

  // LTR: label then checkbox, RTL: checkbox then label
  const children =
    direction === "rtl"
      ? [checkboxNode, labelNode]
      : [labelNode, checkboxNode];

  return (
    <span
      dir={direction}
      style={{
        display: "inline-flex",
        alignItems: "center",
        flexDirection,
        gap: labelSpacing,
        cursor: disabled ? "not-allowed" : "pointer",
        userSelect: "none",
        opacity: disabled ? 0.4 : 1,
        position: "relative",
        transition: "opacity 0.2s ease",
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
  // Group mode
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
    const groupAlignItems =
      isVertical && direction === "rtl" ? "flex-end" : "flex-start";

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
          const isDisabled = !!opt.checkboxProps?.disabled;

          return (
            <label
              key={opt.value}
              dir={direction}
              style={{
                display: "inline-flex",
                alignItems: "center",
                flexDirection:
                  direction === "rtl" ? "row-reverse" : "row",
                gap:
                  opt.checkboxProps?.labelSpacing ??
                  DEFAULTS.labelSpacing,
                cursor: isDisabled ? "not-allowed" : "pointer",
                userSelect: "none",
                opacity: 1,
                position: "relative",
              }}
              onMouseEnter={() =>
                !isDisabled && setHoveredIndex(idx)
              }
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={(e) => {
                if (!isDisabled) {
                  e.preventDefault();
                  if (isChecked) {
                    onGroupChange(
                      values.filter((v) => v !== opt.value),
                    );
                  } else {
                    if (maxSelected === 1) {
                      onGroupChange([opt.value]);
                    } else if (
                      typeof maxSelected !== "number" ||
                      values.length < maxSelected
                    ) {
                      onGroupChange([...values, opt.value]);
                    }
                  }
                }
              }}
            >
              <SingleCheckbox
                {...opt.checkboxProps}
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

  // Single checkbox
  const [hovered, setHovered] = useState(false);

  return (
    <label
      dir={props.direction ?? "ltr"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        flexDirection:
          props.direction === "rtl" ? "row-reverse" : "row",
        gap: props.labelSpacing ?? DEFAULTS.labelSpacing,
        cursor: props.disabled ? "not-allowed" : "pointer",
        userSelect: "none",
        opacity: 1,
        position: "relative",
        ...props.style,
      }}
      className={props.className}
      onMouseEnter={() => !props.disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => {
        if (!props.disabled && props.onChange) {
          e.preventDefault();
          props.onChange(!props.checked);
        }
      }}
    >
      <SingleCheckbox {...props} hovered={hovered} />
    </label>
  );
};

export default CustomCheckbox;
