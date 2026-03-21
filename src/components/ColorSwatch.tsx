
"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import { cn } from '@/lib/utils';

interface ColorSwatchProps {
  color: string;
  size?: 'sm' | 'md' | 'lg' | 'fluid';
}

export const ColorSwatch: React.FC<ColorSwatchProps> = ({ color, size = 'md' }) => {
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();

  const handleCopy = () => {
    navigator.clipboard.writeText(color);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sizeClasses = {
    sm: 'h-8 w-full',
    md: 'h-16 w-full',
    lg: 'h-24 w-full',
    fluid: 'flex-1 min-h-[40px]'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={cn(
        "group relative rounded-lg overflow-hidden cursor-pointer shadow-lg border border-white/10",
        sizeClasses[size]
      )}
      style={{ backgroundColor: color }}
      onClick={handleCopy}
    >
      <div className="absolute inset-0 bg-[hsl(var(--background))]/0 group-hover:bg-[hsl(var(--background))]/20 transition-colors flex items-center justify-center">
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.div
              key="check"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="bg-white/90 text-black p-2 rounded-full shadow-xl"
            >
              <Check className="w-4 h-4" />
            </motion.div>
          ) : (
            <motion.div
              key="copy"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="hidden sm:flex flex-col items-center gap-1"
            >
              <Copy className="w-4 h-4 text-white drop-shadow-md" />
              <span className="text-xs font-bold text-white uppercase drop-shadow-md">{t.ui.copy}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center px-1">
        <span className="font-code text-[11px] font-medium text-white mix-blend-difference opacity-80 uppercase">
          {color}
        </span>
      </div>
    </motion.div>
  );
};
