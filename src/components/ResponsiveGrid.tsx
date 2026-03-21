
"use client";

import React, { useEffect, useState } from 'react';
import { useLanguage } from './LanguageProvider';
import { ActivityCard } from './ActivityCard';
import { PaletteTool } from './tools/PaletteTool';
import { MixTool } from './tools/MixTool';
import { BrightnessTool } from './tools/BrightnessTool';
import { Palette, Blend, Sun } from 'lucide-react';

export const ResponsiveGrid = () => {
  const { t } = useLanguage();
  const [cols, setCols] = useState(1);
  const [activeMobileTab, setActiveMobileTab] = useState(0);

  useEffect(() => {
    const updateGrid = () => {
      const width = window.innerWidth;
      if (width < 860) setCols(1);
      else {
        const extraCols = Math.floor((width - 860) / 420);
        setCols(2 + extraCols);
      }
    };
    
    updateGrid();
    window.addEventListener('resize', updateGrid);
    return () => window.removeEventListener('resize', updateGrid);
  }, []);

  const tools = [
    { title: t.palette.title, icon: <Palette />, component: <PaletteTool /> },
    { title: t.mixer.title, icon: <Blend />, component: <MixTool /> },
    { title: t.brightness.title, icon: <Sun />, component: <BrightnessTool /> },
  ];

  if (cols === 1) {
    return (
      <div className="flex flex-col flex-1">
        <div className="flex border-b border-border/50 sticky top-0 bg-[hsl(var(--background))]/80 backdrop-blur-xl z-20 overflow-x-auto no-scrollbar">
          {tools.map((tool, idx) => (
            <button
              key={idx}
              onClick={() => setActiveMobileTab(idx)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 text-xs font-bold tracking-widest transition-all ${
                activeMobileTab === idx ? 'text-primary bg-primary/5' : 'text-muted-foreground'
              }`}
            >
              {tool.icon}
              <span className="truncate">{tool.title}</span>
            </button>
          ))}
        </div>
        <div className="flex-1">
          <ActivityCard title={tools[activeMobileTab].title} icon={tools[activeMobileTab].icon}>
            {tools[activeMobileTab].component}
          </ActivityCard>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      {tools.map((tool, idx) => (
        <ActivityCard key={idx} title={tool.title} icon={tool.icon}>
          {tool.component}
        </ActivityCard>
      ))}
    </div>
  );
};
