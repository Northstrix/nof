"use client";

import React from "react";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

interface CreditsProps {
  isRtl?: boolean;
  className?: string;
}

export const Credits: React.FC<CreditsProps> = ({ isRtl, className }) => {
  const { t, isRtl: rtlFromContext } = useTranslation();
  const rtl = isRtl ?? rtlFromContext;

    const creditsMarkdown = `
[Color Picker](https://21st.dev/community/components/uplusion23/color-picker/color-picker-with-swatches-and-onchange) by [Trevor McIntire](https://21st.dev/community/uplusion23)

[vue-color-wheel](https://vue-color-wheel.vercel.app/) by [Robert Shaw](https://github.com/xiaoluoboding)

[Resizable Navbar](https://ui.aceternity.com/components/resizable-navbar) by [Aceternity UI](https://ui.aceternity.com/)

[Limelight Nav](https://21st.dev/easemize/limelight-nav/default) by [EaseMize UI](https://21st.dev/easemize)

[Chronicle Button](https://codepen.io/Haaguitos/pen/OJrVZdJ) by [Haaguitos](https://codepen.io/Haaguitos)

[Wheel Picker](https://21st.dev/ncdai/wheel-picker/default) by [Chánh Đại](https://21st.dev/ncdai)

[React Wheel Picker](https://www.npmjs.com/package/@ncdai/react-wheel-picker) by [Chánh Đại](https://github.com/ncdai)

[すりガラスなプロフィールカード](https://codepen.io/ash_creator/pen/zYaPZLB) by [あしざわ - Webクリエイター](https://codepen.io/ash_creator)

[framer-motion](https://www.npmjs.com/package/framer-motion)

[motion](https://www.npmjs.com/package/motion)

[AnimateIcons](https://animateicons.vercel.app/)

[Lucide React](https://www.npmjs.com/package/lucide-react)

[uuid](https://www.npmjs.com/package/uuid)

[radix-ui](https://www.npmjs.com/package/radix-ui)

[sweetalert2](https://github.com/sweetalert2/sweetalert2)

[Custom Checkbox](https://21st.dev/Edil-ozi/custom-checkbox/default) by [Edil Ozi](https://21st.dev/Edil-ozi)

[チェックしないと押せないボタン](https://codepen.io/ash_creator/pen/JjZReNm) by [あしざわ - Webクリエイター](https://codepen.io/ash_creator)

[Input Floating Label animation](https://codepen.io/Mahe76/pen/qBQgXyK) by [Elpeeda](https://codepen.io/Mahe76)

[View transitions - Demo](https://codepen.io/stefanjudis/pen/ByBbNGQ) by [Stefan Judis](https://codepen.io/stefanjudis)
`;

  function renderEntry(entry: string) {
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let key = 0;

    while ((match = regex.exec(entry)) !== null) {
      if (match.index > lastIndex) {
        parts.push(
          <span key={key++}>
            {entry.slice(lastIndex, match.index)}
          </span>
        );
      }

      parts.push(
        <a
          key={key++}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline transition-colors"
        >
          {match[1]}
        </a>
      );

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < entry.length) {
      parts.push(
        <span key={key++}>
          {entry.slice(lastIndex)}
        </span>
      );
    }

    return parts;
  }

  const creditEntries = creditsMarkdown
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div
      className={cn(
        "flex flex-col h-full mt-[-16px] bg-card border border-[var(--border-color)] rounded-[var(--radius)] overflow-hidden",
        rtl ? "rtl" : "ltr",
        className
      )}
    >
      {/* Header (matches ActivityCard) */}
      <div className="flex flex-col pt-6 pb-4 px-4 md:px-6 bg-[hsl(var(--background))]/40 border-b border-white/5 relative z-30">
          <h3
            className={`text-lg tracking-widest text-foreground ${
              isRtl ? "font-semibold" : "font-black"
            }`}
          >
            {t("creditTitle")}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("creditDescription")}
          </p>
      </div>

      {/* Content (matches inner body spacing) */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 md:p-6">
        <ul
          style={{
            listStyleType: "none",
            padding: 0,
            margin: 0,
            lineHeight: 1.75,
            direction: rtl ? "rtl" : "ltr",
            textAlign: rtl ? "right" : "left",
          }}
        >
          {creditEntries.map((entry, idx) => (
            <li
              key={idx}
              style={{
                marginBottom: idx === creditEntries.length - 1 ? 0 : 20,
                wordWrap: "break-word",
                wordBreak: "break-word",
                whiteSpace: "normal",
                fontSize: "0.95rem",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              {renderEntry(entry)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
