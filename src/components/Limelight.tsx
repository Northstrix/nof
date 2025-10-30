"use client";
import React, { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";

interface NavCenterProps {
  isMobile: boolean;
  navTabItems: {
    id: string;
    label: string;
    icon?: React.ReactElement;
  }[];
  activeTab: string;
  onTabClick: (id: string) => void;
  limelightRef: React.RefObject<HTMLDivElement>;
  isReady: boolean;
  isRTL?: boolean;
  activeIconLightenPercentage?: number;
}

const NavCenter: React.FC<NavCenterProps> = ({
  isMobile,
  navTabItems,
  activeTab,
  onTabClick,
  limelightRef,
  isReady,
  isRTL = false,
  activeIconLightenPercentage = 55,
}) => {
  const currentBreakpoint = 480;
  const [showNavCenter, setShowNavCenter] = useState(true);

  const evaluateVisibility = useCallback(() => {
    if (typeof window === "undefined") return true;
    return window.innerWidth >= currentBreakpoint;
  }, []);

  const { t } = useTranslation();

  useEffect(() => {
    const update = () => setShowNavCenter(evaluateVisibility());
    update();
    const timeout = setTimeout(update, 1000);
    window.addEventListener("resize", update);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", update);
    };
  }, [evaluateVisibility]);

  useEffect(() => {
    setShowNavCenter(evaluateVisibility());
    const timeout = setTimeout(() => setShowNavCenter(evaluateVisibility()), 1000);
    return () => clearTimeout(timeout);
  }, [t("mix"), isMobile, evaluateVisibility]);

  // Active index based on current activeTab id
  const activeIndex = navTabItems.findIndex((item) => item.id === activeTab);

  // Position limelight on active tab anchor in DOM
  useEffect(() => {
    if (!limelightRef.current || navTabItems.length === 0 || !isReady) return;
    const limelight = limelightRef.current;
    const parent = limelight.parentElement;
    if (!parent) return;
    const anchors = parent.querySelectorAll("a");
    const activeAnchor = activeIndex >= 0 ? anchors[activeIndex] as HTMLElement : undefined;
    if (activeAnchor) {
      const iconCenter = activeAnchor.offsetLeft + activeAnchor.offsetWidth / 2;
      const limelightLeft = iconCenter - limelight.offsetWidth / 2;
      limelight.style.left = `${limelightLeft}px`;
    } else {
      limelight.style.left = "-999px";
    }
  }, [activeIndex, navTabItems.length, isReady, limelightRef]);

  if (!showNavCenter) return null;

  return (
    <div
      className={cn(
        "absolute inset-0 flex justify-center items-center pointer-events-none",
        isRTL ? "[transform:rotateY(180deg)]" : undefined
      )}
      style={{ direction: "ltr" }}
    >
      <div className="relative flex items-center h-full pointer-events-auto overflow-hidden">
        {navTabItems.map(({ id, icon, label }, index) => {
          const isActive = id === activeTab;
          return (
            <a
              key={id}
              className={cn(
                "relative z-20 flex h-full cursor-pointer items-center justify-center group",
                isMobile ? "p-4" : "p-5",
                isActive
                  ? "opacity-100"
                  : "opacity-100 text-[var(--float-input-lbl-muted-foreground)] hover:text-[hsl(var(--foreground))]"
              )}
              onClick={() => onTabClick(id)}
              aria-label={label}
            >
              {React.cloneElement(icon || <></>, {
                className: cn(
                  isMobile ? "w-[22px] h-[22px]" : "w-6 h-6",
                  "transition-colors duration-300 ease-in-out",
                  isActive ? "opacity-100" : undefined,
                  isRTL ? "[transform:rotateY(180deg)]" : undefined,
                  icon?.props.className
                ),
                style: isActive
                  ? {
                      color: `color-mix(in srgb, hsl(var(--accent)), white ${activeIconLightenPercentage}%)`,
                    }
                  : undefined,
              })}
            </a>
          );
        })}

        {/* Limelight underline indicator */}
        <div
          ref={limelightRef}
          style={{
            position: "absolute",
            top: 0,
            zIndex: 10,
            width: isMobile ? 42 : 44,
            height: 5,
            borderRadius: "0.5rem",
            backgroundColor: "hsl(var(--accent))",
            boxShadow: `0 8px 25px -5px hsl(var(--accent))`,
            transition: isReady ? "left 0.35s cubic-bezier(0.4,0,0.2,1)" : "none",
            left: "-999px",
          }}
        >
          {/* Triangle glow */}
          <div
            style={{
              position: "absolute",
              left: "-30%",
              top: 3,
              width: "160%",
              height: isMobile ? 50 : 56,
              clipPath: "polygon(5% 100%, 25% 0, 75% 0, 95% 100%)",
              background: `linear-gradient(to bottom, hsl(var(--accent)), transparent)`,
              pointerEvents: "none",
            }}
          />
          {/* Bottom glowing line */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              bottom: isMobile ? "-39px" : "-43px",
              width: "82%",
              height: "2px",
              borderRadius: "12px",
              background: `radial-gradient(ellipse 120% 200% at 50% 50%, hsl(var(--accent)), transparent 80%)`,
              boxShadow: `0 0 10px 5px hsl(var(--accent)), inset 0 0 20px 8px hsl(var(--accent))`,
              filter: "blur(5px)",
              zIndex: -1,
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(NavCenter);
