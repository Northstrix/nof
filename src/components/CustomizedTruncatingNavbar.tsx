"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { GithubIcon } from "@/components/github-icon";
import { LanguageIcon } from "@/components/language-icon";
import NavCenter from "./Limelight";
import { getLegacyBackdropStyle } from "./LegacyBackdrop";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
  icon?: React.ReactElement;
}

interface NavbarProps {
  navItems: NavItem[];
  activeId: string;
  onTabSelect: (id: string) => void;
  onLanguageClick?: () => void;
  scrollContainerRef: React.RefObject<HTMLElement>;
  isMobile: boolean;
}

export default function Navbar({
  navItems,
  activeId,
  onTabSelect,
  onLanguageClick,
  scrollContainerRef,
  isMobile,
}: NavbarProps) {
  const { language } = useLanguage();
  const isRTL = language === "he";

  const limelightRef = useRef<HTMLDivElement | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const onScroll = () => setIsScrolled(container.scrollTop > 0);
    onScroll();
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [scrollContainerRef]);

  useEffect(() => {
    if (!isReady) setTimeout(() => setIsReady(true), 60);
  }, [isReady]);

  const backdropStyle = getLegacyBackdropStyle({
    supportsBackdropFilter:
      typeof window !== "undefined" &&
      window.CSS?.supports &&
      (window.CSS.supports("backdrop-filter", "blur(5.2px)") ||
        window.CSS.supports("-webkit-backdrop-filter", "blur(5.2px)")),
    bodyOpacity: 0.64,
    borderOpacity: 0.12,
    blurStrength: 5.2,
    isScrolled,
  });

  const navPaddingY = isMobile ? "py-[4px]" : "py-[8px]";

  return (
    <div style={{ maxWidth: 1448, margin: "0 auto", borderRadius: "var(--radius)" }} id="nav-wrapper">
      <nav
        className="sticky top-0 z-40 w-full bg-transparent"
        style={{
          transform: isScrolled ? (isMobile ? "translateY(6px)" : "translateY(12px)") : "translateY(-1px)",
          transition:
            "transform 0.6s ease, padding-inline-start 0.6s ease, padding-inline-end 0.6s ease, background 0.2s ease, border-color 0.2s ease, backdrop-filter 0.2s ease",
          borderRadius: "var(--radius)",
          paddingLeft: isScrolled ? "24px" : "0px",
          paddingRight: isScrolled ? "24px" : "0px",
        }}
      >
        <div className="w-full mx-auto">
          <div
            className={`relative px-6 flex items-center transition duration-300 ease-in-out justify-between overflow-hidden ${navPaddingY}`}
            style={{ ...backdropStyle, borderRadius: "var(--radius)" }}
          >
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                if (navItems.length > 0) onTabSelect(navItems[0].id);
              }}
              className="flex items-center cursor-pointer gap-2 font-bold"
              style={{ color: "var(--foreground)", userSelect: "none" }}
            >
              <Image src="/logo.png" alt="logo" width={32} height={32} className="rounded-md" />
              <span className="text-lg font-bold">{isRTL ? "נוף" : "Nof"}</span>
            </a>

            <div style={{ direction: "ltr" }}>
              <NavCenter
                isMobile={isMobile}
                navTabItems={navItems}
                activeTab={activeId}
                onTabClick={onTabSelect}
                limelightRef={limelightRef}
                isReady={isReady}
                isRTL={isRTL}
              />
            </div>

            <div
            className={cn(
                "flex items-center gap-[10px]",
                isRTL ? "mr-auto" : "ml-auto"
            )}
            >
              <button
                onClick={onLanguageClick}
                aria-label="Language"
                className="group relative w-9 h-9 rounded-[var(--radius)] flex items-center justify-center transition-colors"
              >
                <LanguageIcon className="w-6 h-6 text-foreground opacity-65 group-hover:opacity-100 group-hover:text-black transition-opacity z-10" />
                <div className="absolute inset-0 rounded-[var(--radius)] group-hover:bg-accent transition-colors z-0" />
              </button>

              <a
                href="https://github.com/Northstrix/nof"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="group relative w-9 h-9 rounded-[var(--radius)] flex items-center justify-center transition-colors"
              >
                <GithubIcon className="w-6 h-6 text-foreground opacity-65 group-hover:opacity-100 group-hover:text-black transition-opacity z-10" />
                <div className="absolute inset-0 rounded-[var(--radius)] group-hover:bg-accent transition-colors z-0" />
              </a>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
