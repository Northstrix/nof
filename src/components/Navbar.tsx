"use client";
import React, { useEffect, useState, useRef } from "react";
import { GithubIcon } from "@/components/github-icon";
import { LanguageIcon } from "@/components/language-icon";
import { getLegacyBackdropStyle } from "./LegacyBackdrop";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";

interface NavItem {
  id: string;
  label: string;
  icon?: React.ReactElement;
  targetId: string;
}

interface NavbarProps {
  navItems: NavItem[];
  onTabSelect: (id: string) => void;
  onLanguageClick?: () => void;
  scrollContainerRef: React.RefObject<HTMLElement | null>;
  isMobile: boolean;
  isRTL?: boolean;
}

export default function Navbar({
  navItems,
  onTabSelect,
  onLanguageClick,
  scrollContainerRef,
  isMobile,
  isRTL,
}: NavbarProps) {
  const { t, isRtl } = useTranslation();
  const rtl = typeof isRTL === "boolean" ? isRTL : !!isRtl;

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
      (window as any).CSS?.supports &&
      ((window as any).CSS.supports("backdrop-filter", "blur(5.2px)") ||
        (window as any).CSS.supports("-webkit-backdrop-filter", "blur(5.2px)")),
    bodyOpacity: 0.64,
    borderOpacity: 0.14,
    blurStrength: 5.2,
    isScrolled,
  });

  const navPaddingY = isMobile ? "py-[12px]" : "py-[10px]";

  if (rtl) {
    // your RTL version, untouched except for appName
    return (
      <div
        id="nav-wrapper"
        style={{
          maxWidth: 1448,
          margin: "0 auto",
          borderRadius: "var(--radius)",
        }}
        dir="rtl"
      >
        <nav
          className="sticky top-0 z-40 w-full bg-transparent"
          style={{
            transform: isScrolled
              ? isMobile
                ? "translateY(6px)"
                : "translateY(12px)"
              : "translateY(3px)",
            transition:
              "transform 0.6s ease, padding-inline-start 0.6s ease, padding-inline-end 0.6s ease, background 0.2s ease, border-color 0.2s ease, backdrop-filter 0.2s ease",
            borderRadius: "var(--radius)",
            paddingLeft: isScrolled ? "24px" : "0px",
            paddingRight: isScrolled ? "24px" : "0px",
          }}
        >
          <div className="w-full mx-auto">
            <div
              className={cn(
                "relative px-6 flex items-center transition duration-300 ease-in-out justify-between overflow-hidden",
                navPaddingY,
                "flex-row-reverse"
              )}
              style={{ ...backdropStyle, borderRadius: "var(--radius)" }}
            >
              <div
                className={cn(
                  "flex items-center gap-[10px]",
                  "mr-auto flex-row-reverse"
                )}
              >
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
                <button
                  onClick={onLanguageClick}
                  aria-label="Language"
                  className="group relative w-9 h-9 rounded-[var(--radius)] flex items-center justify-center transition-colors"
                >
                  <LanguageIcon className="w-6 h-6 text-foreground opacity-65 group-hover:opacity-100 group-hover:text-black transition-opacity z-10" />
                  <div className="absolute inset-0 rounded-[var(--radius)] group-hover:bg-accent transition-colors z-0" />
                </button>
              </div>

              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  if (navItems.length > 0) onTabSelect(navItems[0].id);
                }}
                className={cn(
                  "flex items-center cursor-pointer gap-2 font-bold group select-none",
                  "flex-row-reverse"
                )}
                style={{ color: "var(--foreground)" }}
              >
                <span className="text-lg font-bold transition-colors duration-300 ease-in-out group-hover:text-[hsl(var(--accent))]">
                  {t("appName")}
                </span>
                <img
                  src="/logo.png"
                  alt="Logo"
                  width={32}
                  height={32}
                  className="rounded-md object-contain w-8 h-8"
                />
              </a>
            </div>
          </div>
        </nav>
      </div>
    );
  }

  // your LTR version, untouched except for appName and no NavCenter
  return (
    <div
      id="nav-wrapper"
      style={{
        maxWidth: 1448,
        margin: "0 auto",
        borderRadius: "var(--radius)",
      }}
      dir="ltr"
    >
      <nav
        className="sticky top-0 z-40 w-full bg-transparent"
        style={{
          transform: isScrolled
            ? isMobile
              ? "translateY(6px)"
              : "translateY(12px)"
            : "translateY(3px)",
          transition:
            "transform 0.6s ease, padding-inline-start 0.6s ease, padding-inline-end 0.6s ease, background 0.2s ease, border-color 0.2s ease, backdrop-filter 0.2s ease",
          borderRadius: "var(--radius)",
          paddingLeft: isScrolled ? "24px" : "0px",
          paddingRight: isScrolled ? "24px" : "0px",
        }}
      >
        <div className="w-full mx-auto">
          <div
            className={cn(
              "relative px-6 flex items-center transition duration-300 ease-in-out justify-between overflow-hidden",
              navPaddingY
            )}
            style={{ ...backdropStyle, borderRadius: "var(--radius)" }}
          >
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                if (navItems.length > 0) onTabSelect(navItems[0].id);
              }}
              className={cn(
                "flex items-center cursor-pointer gap-2 font-bold group select-none"
              )}
              style={{ color: "var(--foreground)" }}
            >
              <img
                src="/logo.png"
                alt="Logo"
                width={32}
                height={32}
                className="rounded-md object-contain w-8 h-8"
              />
              <span className="text-lg font-bold transition-colors duration-300 ease-in-out group-hover:text-[hsl(var(--accent))]">
                {t("appName")}
              </span>
            </a>

            <div className={cn("flex items-center gap-[10px]", "ml-auto")}>
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
