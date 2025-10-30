"use client";
import React, { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { hexToHsva, hsvaToHex } from "@uiw/color-convert";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "@/hooks/use-translation";
import CustomizedTruncatingNavbar from "@/components/CustomizedTruncatingNavbar";
import { ColorPicker } from "@/components/color-picker";
import { Palettes } from "@/components/palettes";
import { ColorTools } from "@/components/color-tools";
import * as colorUtil from "@/lib/color-utils";
import { TabSwitcher } from "@/components/ui/tab-switcher";
import { Credits } from "@/components/credits";
import { AppFooter } from "@/components/app-footer";
import { Separator } from "@/components/ui/separator";
import { ModeSelector } from "@/components/mode-selector";
import { Palette, Droplet, Sun } from "lucide-react";
import { LanguageSelector, LanguageSelectorHandle } from "@/components/LanguageSelector";

export default function Home() {
  const { t } = useTranslation();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  const [baseColor, setBaseColor] = useState(hexToHsva("#00A2FA"));
  const [activeTab, setActiveTab] = useState("palette");
  const [activeMode, setActiveMode] = useState(() =>
    [
      "analogous",
      "triad",
      "complementary",
      "splitComplementary",
      "square",
      "tetradic",
      "convergence",
    ][0]
  );

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const languageSelectorRef = React.useRef<LanguageSelectorHandle>(null);
  const tabContentRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);

  const harmonyTypes = useMemo(
    () => [
      "analogous",
      "triad",
      "complementary",
      "splitComplementary",
      "square",
      "tetradic",
      "convergence",
    ],
    []
  );

  // Calculate harmonies whenever baseColor changes
  const harmonies = useMemo(() => {
    try {
      return colorUtil.getColorHarmonies(hsvaToHex(baseColor));
    } catch {
      return {
        analogous: [],
        triad: [],
        complementary: [],
        splitComplementary: [],
        square: [],
        tetradic: [],
        convergence: [],
      };
    }
  }, [baseColor]);

  const tabIcons = useMemo(
    () => ({
      palette: <Palette />,
      mix: <Droplet />,
      brightness: <Sun />,
    }),
    []
  );

  const navTabItems = useMemo(
    () => [
      { id: "palette", label: t("palette"), icon: tabIcons.palette },
      { id: "mix", label: t("mix"), icon: tabIcons.mix },
      { id: "brightness", label: t("brightness"), icon: tabIcons.brightness },
    ],
    [t, tabIcons]
  );

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, []);

  const openLanguageModal = () => {
    languageSelectorRef.current?.open();
  };

  // Key depends only on tab, so color change won't remount
  const tabContentKey = activeTab;

  // Scroll to top logic: scroll if main content is not visible on tab change
  useEffect(() => {
    if (!mainContentRef.current) return;

    const rect = mainContentRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const fullyVisible = rect.top >= 0 && rect.bottom <= viewportHeight;

    if (!fullyVisible) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeTab]);

  if (!isClient) return null;

  return (
    <div
      ref={scrollContainerRef}
      className="fixed top-0 left-0 w-screen h-screen overflow-y-auto overflow-x-hidden bg-black text-foreground"
      style={{ minHeight: "100vh", maxHeight: "100vh" }}
    >
      <div className="sticky top-0 z-50">
        <CustomizedTruncatingNavbar
          navItems={navTabItems}
          activeId={activeTab}
          onTabSelect={handleTabChange}
          scrollContainerRef={scrollContainerRef}
          showTabs={true}
          isMobile={false}
          onLanguageClick={openLanguageModal}
        />
      </div>

      <main
        ref={mainContentRef}
        className="container mx-auto px-6 py-8"
        style={{ maxWidth: "1448px" }}
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl lg:text-5xl font-headline tracking-tight">{t("title")}</h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          {/* TabSwitcher is outside remount container */}
          <TabSwitcher
            tabs={navTabItems.map(({ id, label, icon }) => ({ id, label, icon }))}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />

          <Separator className="my-6" />

          {/* Only tab content remounts on tab change */}
          <div key={tabContentKey} ref={tabContentRef}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "palette" && (
                  <div className="grid grid-cols-1 lg:grid-cols-[346px_auto_1fr] gap-x-4 gap-y-8">
                    <div className="flex-shrink-0 space-y-4">
                      <h2 className="text-2xl font-headline text-left">{t("baseColor")}</h2>
                      {/* baseColor setter is here; does not trigger remount */}
                      <ColorPicker value={baseColor} onValueChange={setBaseColor} />
                    </div>
                    <div className="flex-shrink-0 space-y-4 flex flex-col items-start">
                      <h2 className="text-2xl font-headline text-left">{t("mode")}</h2>
                      <ModeSelector
                        options={harmonyTypes.map((key) => ({
                          label: t(key),
                          value: key,
                        }))}
                        value={activeMode}
                        onValueChange={setActiveMode}
                      />
                    </div>
                    <div className="space-y-4 w-full">
                      <h2 className="text-2xl font-headline text-left">{t("output")}</h2>
                      {/* harmonies recomputed on baseColor only */}
                      <Palettes harmonies={harmonies} activeMode={activeMode} />
                    </div>
                  </div>
                )}
                {(activeTab === "mix" || activeTab === "brightness") && (
                  <ColorTools baseColor={hsvaToHex(baseColor)} activeTab={activeTab} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6">
          <Credits />
        </div>
      </main>

      <AppFooter />

      <LanguageSelector ref={languageSelectorRef} />
    </div>
  );
}
