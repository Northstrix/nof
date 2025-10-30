'use client';

import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
}

interface TabSwitcherProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export const TabSwitcher: React.FC<TabSwitcherProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  const [tabWidth, setTabWidth] = useState<number | null>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!measureRef.current) return;
    const widths = Array.from(measureRef.current.children).map(
      (child) => (child as HTMLElement).offsetWidth
    );
    const maxWidth = Math.max(...widths);
    setTabWidth(maxWidth);
  }, [tabs]);

  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    tabId: string
  ) => {
    e.preventDefault();
    onTabChange(tabId);
  };

  return (
    <nav className="view-transition-nav relative rounded-xl bg-[#111] p-2 md:p-3 flex items-center gap-2 md:gap-4 justify-center flex-wrap">
      {/* Invisible measurement layer */}
      <div
        ref={measureRef}
        className="absolute opacity-0 pointer-events-none flex whitespace-nowrap"
      >
        {tabs.map((tab) => (
          <span
            key={`measure-${tab.id}`}
            className="px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base font-medium whitespace-nowrap"
          >
            {tab.label}
          </span>
        ))}
      </div>

      {/* Visible tabs */}
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={(e) => handleClick(e, tab.id)}
            className={cn(
              'relative text-sm md:text-base rounded-lg px-3 py-1.5 md:px-4 md:py-2 flex justify-center items-center whitespace-nowrap isolation-isolate',
              'border transition-colors transition-border ease-in-out duration-300',
              isActive
                ? 'bg-primary border-primary text-primary-foreground'
                : 'bg-[hsl(var(--background))] border-[hsl(var(--border))] text-muted-foreground hover:bg-[hsl(var(--border))] hover:text-foreground hover:border-[hsl(var(--border))]'
            )}
            style={{ width: tabWidth ? `${tabWidth}px` : 'auto' }}
          >
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
