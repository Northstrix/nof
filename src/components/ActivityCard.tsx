
"use client";
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { PaletteTool } from './tools/PaletteTool';
import { MixTool } from './tools/MixTool';
import { BrightnessTool } from './tools/BrightnessTool';
import { Palette, Blend, Sun, X } from 'lucide-react';
import NavCenter from './Limelight';

export type ToolMode = 'palette' | 'mix' | 'brightness';

interface ActivityCardProps {
  mode: ToolMode;
  onModeChange: (mode: ToolMode) => void;
  onRemove?: () => void;
  showRemove?: boolean;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ mode, onModeChange, onRemove, showRemove }) => {
  const { t, isRtl } = useTranslation();
  const limelightRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [cardWidth, setCardWidth] = useState(0);

  useEffect(() => {
    setIsReady(true);
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      setCardWidth(entries[0].contentRect.width);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const navTabItems = [
    { id: 'palette', label: t('palette'), icon: <Palette /> },
    { id: 'mix', label: t('mix'), icon: <Blend /> },
    { id: 'brightness', label: t('brightness'), icon: <Sun /> },
  ];

  // Padding Logic: 24px if width >= 640px, else 16px
  const padding = cardWidth >= 640 ? 24 : 16;
  const gap = padding; // Internal gap matches padding

  const renderTool = () => {
    switch (mode) {
      case 'palette': return <PaletteTool cardWidth={cardWidth} gap={gap} />;
      case 'mix': return <MixTool cardWidth={cardWidth} gap={gap} />;
      case 'brightness': return <BrightnessTool cardWidth={cardWidth} gap={gap} />;
    }
  };

  const currentModeLabel = mode === 'palette' ? t('palette') : mode === 'mix' ? t('mix') : t('brightness');

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex flex-col h-full bg-card border border-[var(--border-color)] rounded-[var(--radius)] overflow-hidden group/card"
    >
      <div className="flex flex-col pt-6 pb-4 px-4 md:px-6 bg-[hsl(var(--background))]/40 border-b border-white/5 relative z-30">
        <div className="flex items-center justify-between mb-6">
          <span className={cn(
            "text-xs tracking-[0.3em] transition-colors duration-300",
            isHovered ? "text-white/60" : "text-white/40",
            isRtl ? "text-right" : "text-left"
          )}>
            {currentModeLabel}
          </span>
          {showRemove && (
            <button 
              onClick={onRemove}
              className="p-1 text-white/20 hover:text-red-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <div className="relative h-14 bg-[hsl(var(--background))] rounded-[var(--radius)] border border-[var(--border-color)] overflow-hidden mb-2">
          <NavCenter 
            isMobile={false}
            navTabItems={navTabItems}
            activeTab={mode}
            onTabClick={(id) => onModeChange(id as ToolMode)}
            limelightRef={limelightRef}
            isReady={isReady}
            isRTL={isRtl}
          />
        </div>
      </div>

      <div 
        className="flex-1 overflow-y-auto no-scrollbar"
        style={{ padding: `${padding}px` }}
      >
        <div 
          className="flex flex-col"
          style={{ gap: `${gap}px` }}
        >
          {renderTool()}
        </div>
      </div>
    </motion.div>
  );
};
