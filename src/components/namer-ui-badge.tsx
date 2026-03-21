"use client";

import React, { useState } from "react";

interface NamerUiBadgeProps {
  href?: string;
  isRTL?: boolean;
  isMobile?: boolean;
  poweredByText?: string;
  namerUIName?: string;
}

export default function NamerUiBadge({
  href = "https://namer-ui.vercel.app/",
  isRTL = false,
  isMobile = false,
  poweredByText = "Powered by",
  namerUIName = "Namer UI",
}: NamerUiBadgeProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      dir={isRTL ? "rtl" : "ltr"}
      className="inline-flex flex-col rounded-md select-none"
      style={{
        background: isHovered ? "#141414" : "#111",
        border: `1px solid ${isHovered ? "#303030" : "#242424"}`,
        padding: isMobile ? "8px 16px 16px 16px" : "16px 24px 24px 24px",
        userSelect: "none",
        maxWidth: "max-content",
        textAlign: isRTL ? "right" : "left",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      onClick={(e) => e.stopPropagation()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span
        className="text-[var(--sub-foreground)] text-[12px] mb-2"
        style={{ userSelect: "none" }}
      >
        {poweredByText}
      </span>
      <div
        className="inline-flex items-center gap-3"
        style={{
          justifyContent: isRTL ? "flex-end" : "flex-start",
        }}
      >
        <img
          src="/namer-ui-logo.png"
          alt={namerUIName}
          width={32}
          height={32}
          style={{ objectFit: "contain", display: "inline-block" }}
        />
        <span
          className="font-bold text-base text-[var(--foreground)] select-none"
          dir={isRTL ? "rtl" : "ltr"}
        >
          {namerUIName}
        </span>
      </div>
    </a>
  );
}