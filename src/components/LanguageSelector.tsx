
"use client";
import React, { useEffect, useState, useCallback, useImperativeHandle } from "react";
import { WheelPicker } from "@ncdai/react-wheel-picker";
import "@ncdai/react-wheel-picker/style.css";
import ChronicleButton from "./RefinedChronicleButton";
import { AnimatePresence, motion } from "framer-motion";
import { ModalOverlay } from "./modal-overlay";
import { useLanguage } from "@/components/LanguageProvider";

export interface LanguageSelectorHandle {
  open: () => void;
  close: () => void;
}

interface LanguageSelectorProps {
  onClose?: () => void;
}

const ANIMATION_DURATION = 0.3;

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

function StyledWheelPicker({ ...props }: any) {
  return (
    <WheelPicker
      classNames={{
        optionItem: "text-white/40 transition-colors duration-200 hover:text-white", // muted text with hover brightening
        highlightWrapper:
          "bg-[hsl(var(--accent))] text-[hsl(var(--background))] border border-[var(--border-color)]", // center highlight matches theme accent/foreground
      }}
      {...props}
    />
  );
}

export const LanguageSelector = React.forwardRef<LanguageSelectorHandle, LanguageSelectorProps>(function LanguageSelector({ onClose }, ref) {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const [tempSelectedValue, setTempSelectedValue] = useState(locale);

  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
    close: () => setOpen(false),
  }));

  useEffect(() => {
    setTempSelectedValue(locale);
  }, [locale]);

  const handleValueChange = useCallback((value: string) => {
    setTempSelectedValue(value as any);
  }, []);

  const handleApply = async () => {
    if (tempSelectedValue !== locale) {
      await new Promise(resolve => setTimeout(resolve, 30));
      setLocale(tempSelectedValue as any);
    }
    setOpen(false);
    onClose?.();
  };

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  const applyButtonText = LANGUAGES.find(l => l.code === tempSelectedValue)?.applyText || "Apply";
  const options = LANGUAGES.map(l => ({ label: l.label, value: l.code }));

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
            className="relative rounded-lg shadow-xl p-4 md:p-6 min-w-[240px] max-w-[90vw] border border-white/10 flex flex-col items-center outline-none bg-[hsl(var(--background))]"
          >
            <span className="mb-4 font-semibold text-[20px]">Language</span>
            <div className="w-full rounded-md mb-4 md:mb-7 overflow-hidden flex justify-center bg-card border border-white/10">
              <StyledWheelPicker options={options} value={tempSelectedValue} onValueChange={handleValueChange} />
            </div>
            <ChronicleButton
              onClick={handleApply}
              className="w-full"
              backgroundColor="hsl(var(--foreground))"
              hoverBackgroundColor="hsl(var(--accent))"
              textColor="hsl(var(--background))"
              hoverTextColor="hsl(var(--foreground))"
              borderVisible={false}
              borderRadius="var(--radius)"
              fontWeight={500}
              width="100%"
            >
              {applyButtonText}
            </ChronicleButton>
          </motion.div>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
});
