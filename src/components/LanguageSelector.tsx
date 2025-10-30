"use client";

import React, { useEffect, useState, useCallback, useImperativeHandle } from "react";
import * as WheelPickerPrimitive from "@ncdai/react-wheel-picker";
import "@ncdai/react-wheel-picker/style.css";
import ChronicleButton from "./RefinedChronicleButton";
import { AnimatePresence, motion } from "framer-motion";
import { ModalOverlay } from "./modal-overlay";
import { useLanguage } from "@/contexts/language-context";
import { useTranslation } from "@/hooks/use-translation";

export interface LanguageSelectorHandle {
  open: () => void;
  close: () => void;
}

interface LanguageSelectorProps {
  onClose?: () => void;
}

const ANIMATION_DURATION = 0.3;

// Language list with localized Apply captions
const LANGUAGES = [
  { code: "en", label: "English", applyText: "Apply" },
  { code: "he", label: "עברית", applyText: "החל" },
  { code: "it", label: "Italiano", applyText: "Applica" },
  { code: "es", label: "Español", applyText: "Aplicar" },
  { code: "pt", label: "Português", applyText: "Aplicar" },
  { code: "yue", label: "粵語", applyText: "套用" },
  { code: "ja", label: "日本語", applyText: "適用する" },
  { code: "ko", label: "한국어", applyText: "적용" },
  { code: "vi", label: "Tiếng Việt", applyText: "Áp dụng" },
  { code: "pl", label: "Polski", applyText: "Zastosuj" },
  { code: "cs", label: "Čeština", applyText: "Použít" },
  { code: "hu", label: "Magyar", applyText: "Alkalmaz" },
  { code: "fr", label: "Français", applyText: "Appliquer" },
  { code: "de", label: "Deutsch", applyText: "Anwenden" },
  { code: "nl", label: "Nederlands", applyText: "Toepassen" },
];

// WheelPicker styling (center highlight and background)
function WheelPicker({
  classNames,
  ...props
}: React.ComponentProps<typeof WheelPickerPrimitive.WheelPicker>) {
  return (
    <WheelPickerPrimitive.WheelPicker
      classNames={{
        optionItem: "text-muted-foreground",
        highlightWrapper:
          "bg-[var(--language-selector-center-line-bg,#39bdff)] text-[hsl(var(--accent-foreground))]",
        ...classNames,
      }}
      {...props}
    />
  );
}

export const LanguageSelector = React.forwardRef<LanguageSelectorHandle, LanguageSelectorProps>(
  function LanguageSelector({ onClose }, ref) {
    const { language, setLanguage } = useLanguage();
    const { t } = useTranslation();

    const [open, setOpen] = useState(false);
    const [tempSelectedValue, setTempSelectedValue] = useState(language);

    useImperativeHandle(ref, () => ({
      open: () => setOpen(true),
      close: () => setOpen(false),
    }));

    useEffect(() => {
      setTempSelectedValue(language);
    }, [language]);

    const handleValueChange = useCallback((value: string) => {
      setTempSelectedValue(value as any);
    }, []);

    const handleApply = async () => {
      if (tempSelectedValue !== language) {
        await new Promise(resolve => setTimeout(resolve, 30));
        setLanguage(tempSelectedValue as any);
      }
      setOpen(false);
      onClose?.();
    };

    const handleClose = () => {
      setOpen(false);
      onClose?.();
    };

    const applyButtonText =
      LANGUAGES.find(l => l.code === tempSelectedValue)?.applyText || "Apply";

    const options = LANGUAGES.map(l => ({
      label: l.label,
      value: l.code,
    }));

    return (
      <AnimatePresence>
        {open && (
          <ModalOverlay onClose={handleClose}>
            <motion.div
              key="language-selector"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: ANIMATION_DURATION, ease: "easeInOut" }}
              tabIndex={-1}
              onClick={e => e.stopPropagation()}
              className="relative rounded-lg shadow-xl p-4 md:p-6 min-w-[240px] max-w-[90vw] border flex flex-col items-center outline-none"
              style={{
                backgroundColor: `hsl(var(--background))`,
                borderColor: `hsl(var(--border))`,
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0,0,0,0.1)",
              }}
            >
              <span className="mb-4 font-semibold text-[20px]">Language</span>
              <div
                className="w-full rounded-md mb-4 md:mb-7 overflow-hidden flex justify-center"
                style={{
                  backgroundColor: "hsl(var(--card)",
                  border: `1px solid hsl(var(--border))`,
                }}
              >
                <WheelPicker
                  options={options}
                  value={tempSelectedValue}
                  onValueChange={handleValueChange}
                />
              </div>

              <ChronicleButton
                onClick={handleApply}
                className="w-full"
                variant="default"
                backgroundColor="hsl(var(--foreground))"
                hoverBackgroundColor="hsl(var(--accent))"
                textColor="hsl(var(--background))"
                hoverTextColor="hsl(var(--foreground))"
                borderVisible={false}
                borderRadius="var(--radius)"
                fontWeight={500}
              >
                {applyButtonText}
              </ChronicleButton>
            </motion.div>
          </ModalOverlay>
        )}
      </AnimatePresence>
    );
  }
);
