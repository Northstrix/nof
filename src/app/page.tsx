"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LanguageProvider } from "@/components/LanguageProvider";
import { ActivityCard, ToolMode } from "@/components/ActivityCard";
import { cn } from "@/lib/utils";
import { Credits } from "@/components/credits";
import { useTranslation } from "@/hooks/use-translation";
import Navbar from "@/components/Navbar";
import { LanguageSelector, LanguageSelectorHandle } from "@/components/LanguageSelector";
import { AppFooter } from "@/components/Footer";
function MainLayout() {
  const { t, isRtl } = useTranslation();

  const [columnModes, setColumnModes] = useState<ToolMode[]>(["palette"]);
  const [maxAllowedCols, setMaxAllowedCols] = useState(1);
  const [isReady, setIsReady] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  const scrollRef = useRef<HTMLDivElement>(null);
  const langSelectorRef = useRef<LanguageSelectorHandle>(null);

  useEffect(() => {
    const updateCols = () => {
      const width = window.innerWidth;
      setViewportWidth(width);
      let allowed = 1;
      if (width >= 860) {
        allowed = 2 + Math.floor((width - 860) / 420);
      }
      const capped = Math.min(allowed, 9);
      setMaxAllowedCols(capped);
      setColumnModes((prev) => {
        if (prev.length > capped) return prev.slice(0, capped);
        return prev;
      });
    };

    updateCols();
    const timer = setTimeout(() => setIsReady(true), 100);
    window.addEventListener("resize", updateCols);

    return () => {
      window.removeEventListener("resize", updateCols);
      clearTimeout(timer);
    };
  }, []);

  const handleSetColumns = (count: number) => {
    setColumnModes((prev) => {
      if (count > prev.length) {
        const added = Array(count - prev.length).fill("palette");
        return [...prev, ...added];
      }
      return prev.slice(0, count);
    });
  };

  const handleRemoveColumn = (idx: number) => {
    if (columnModes.length > 1) {
      setColumnModes(columnModes.filter((_, i) => i !== idx));
    }
  };

  const handleModeChange = (idx: number, newMode: ToolMode) => {
    const next = [...columnModes];
    next[idx] = newMode;
    setColumnModes(next);
  };

  const navItems = [
    { id: "palette", label: t("palette"), targetId: "home" },
    { id: "mix", label: t("mix"), targetId: "home" },
    { id: "brightness", label: t("brightness"), targetId: "home" },
  ];

  const mainGapClass = viewportWidth >= 1024 ? "gap-6" : "gap-4";

  return (
    <AnimatePresence>
      {isReady && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col h-screen w-screen overflow-hidden bg-[hsl(var(--background))] selection:bg-primary/30"
        >
          <div
            ref={scrollRef}
            id="page-scroll-container"
            className="flex-grow w-full h-full overflow-y-auto overflow-x-hidden custom-viewport-scrollbar"
            dir={isRtl ? "rtl" : "ltr"}
          >
            <div id="home-anchor" className="h-0 m-0 p-0" />

            <div className="sticky top-0 z-[1000] w-full bg-transparent">
              <Navbar
                navItems={navItems}
                onTabSelect={() => {}}
                onLanguageClick={() => langSelectorRef.current?.open()}
                scrollContainerRef={scrollRef as any}
                isMobile={typeof window !== "undefined" && window.innerWidth < 768}
                isRTL={isRtl}
              />
            </div>

            <main className="flex-1 flex flex-col min-h-full">
              <div className="max-w-screen-2xl mx-auto w-full px-4 sm:px-6 py-12 text-center space-y-4">
                <h2
                  className={`text-4xl sm:text-6xl tracking-tight leading-tight text-foreground ${
                    isRtl ? "font-semibold" : "font-black"
                  }`}
                >
                  {t("appName")}
                </h2>
                <p className="max-w-xl mx-auto text-lg text-white/40 font-medium leading-relaxed">
                  {t("subtitle")}
                </p>
              </div>

              {/* Only show tab switcher if more than one allowed */}
              {maxAllowedCols > 1 && (
                <div
                  className={cn(
                    "px-[10px] md:px-[24px] mx-auto w-full mb-8 flex justify-start",
                    isRtl ? "rtl" : "ltr"
                  )}
                >
                  <div className="bg-card border border-[var(--border-color)] rounded-[var(--radius)] p-4 inline-flex flex-col items-start gap-3">
                    <span className="text-xs font-medium text-white/60 lowercase first-letter:uppercase">
                      {t("tabs")}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {Array.from({ length: maxAllowedCols }, (_, i) => i + 1).map((n) => (
                        <button
                          key={n}
                          onClick={() => handleSetColumns(n)}
                          className={cn(
                            "w-8 h-8 flex items-center justify-center text-base rounded-[var(--radius)] border transition-all",
                            columnModes.length === n
                              ? "bg-primary border-primary text-black"
                              : "bg-[hsl(var(--background))] border-[var(--border-color)] text-white/40 hover:bg-white/10 hover:text-white"
                          )}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className={cn("px-[10px] md:px-[24px] pb-12", isRtl ? "rtl" : "ltr")}>
                <div className={cn("flex flex-col md:flex-row items-stretch", mainGapClass)}>
                  {columnModes.map((mode, idx) => (
                    <div key={idx} className="flex-1">
                      <ActivityCard
                        mode={mode}
                        onModeChange={(newMode) => handleModeChange(idx, newMode)}
                        onRemove={() => handleRemoveColumn(idx)}
                        showRemove={columnModes.length > 1}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div
                className={cn(
                  "mx-auto w-full px-[10px] md:px-[24px] pb-12",
                  isRtl ? "rtl" : "ltr"
                )}
              >
                <Credits isRtl={isRtl} />
                <AppFooter/>
              </div>
            </main>
          </div>
          <LanguageSelector ref={langSelectorRef} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Home() {
  return (
    <LanguageProvider>
      <MainLayout />
    </LanguageProvider>
  );
}
