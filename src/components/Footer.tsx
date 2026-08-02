"use client";

import { useState } from "react";
import { useTranslation } from "@/hooks/use-translation";
import NamerUiBadge from "./namer-ui-badge";

type TextPart = {
  text: string;
  isLink: boolean;
  link?: {
    href: string;
    text: string;
  };
};

type LanguageStrings = {
  line: TextPart[];
  line2?: TextPart[];
};

export function AppFooter() {
  const { locale } = useTranslation();
  const { t } = useTranslation();

  const [verifiedToolsLogoLoaded, setVerifiedToolsLogoLoaded] = useState(false);
  const [auraPlusPlusLogoLoaded, setAuraPlusPlusLogoLoaded] = useState(false);
  const [twelveToolsLogoLoaded, setTwelveToolsLogoLoaded] = useState(false);
  const [productHuntLoaded, setProductHuntLoaded] = useState(false);

  const madeByText: Record<string, LanguageStrings> = {
      en: { line: [ { text: `${t('madeBy')} `, isLink: false }, { text: "Maxim Bortnikov", isLink: true, link: { href: "https://maxim-bortnikov.netlify.app/", text: "Maxim Bortnikov" } }, { text: ` ${t('using')} `, isLink: false }, { text: "Next.js", isLink: true, link: { href: "https://nextjs.org/", text: "Next.js" } }, { text: ", ", isLink: false }, { text: "Perplexity", isLink: true, link: { href: "https://www.perplexity.ai/", text: "Perplexity" } }, { text: ", ", isLink: false }, { text: t('and'), isLink: false }, { text: "Firebase Studio", isLink: true, link: { href: "https://firebase.studio/", text: "Firebase Studio" } } ]},
      he: { 
        line: [ // FIRST LINE: "נוצר על ידי מקסים בורטניקוב"
          { text: `${t('madeBy')} `, isLink: false },
          { text: "מקסים בורטניקוב", isLink: true, link: { href: "https://maxim-bortnikov.netlify.app/", text: "מקסים בורטניקוב" } }
        ],
        line2: [ // SECOND LINE: "באמצעות Next.js, Perplexity ופיירבייס סטודיו"
          { text: ` ${t('using')} `, isLink: false }, { text: "Perplexity", isLink: true, link: { href: "https://www.perplexity.ai/", text: "Perplexity" } }, { text: " ,", isLink: false }, { text: "Next.js", isLink: true, link: { href: "https://nextjs.org/", text: "Next.js" } }, { text: ", ו", isLink: false }, { text: "פיירבייס סטודיו", isLink: true, link: { href: "https://firebase.studio/", text: "פיירבייס סטודיו" } }
        ]
      },
      it: { line: [ { text: `${t('madeBy')} `, isLink: false }, { text: "Maxim Bortnikov", isLink: true, link: { href: "https://maxim-bortnikov.netlify.app/", text: "Maxim Bortnikov" } }, { text: ` ${t('using')} `, isLink: false }, { text: "Next.js", isLink: true, link: { href: "https://nextjs.org/", text: "Next.js" } }, { text: ", ", isLink: false }, { text: "Perplexity", isLink: true, link: { href: "https://www.perplexity.ai/", text: "Perplexity" } }, { text: ", ", isLink: false }, { text: t('and'), isLink: false }, { text: "Firebase Studio", isLink: true, link: { href: "https://firebase.studio/", text: "Firebase Studio" } } ]},
      es: { line: [ { text: `${t('madeBy')} `, isLink: false }, { text: "Maxim Bortnikov", isLink: true, link: { href: "https://maxim-bortnikov.netlify.app/", text: "Maxim Bortnikov" } }, { text: ` ${t('using')} `, isLink: false }, { text: "Next.js", isLink: true, link: { href: "https://nextjs.org/", text: "Next.js" } }, { text: ", ", isLink: false }, { text: "Perplexity", isLink: true, link: { href: "https://www.perplexity.ai/", text: "Perplexity" } }, { text: ", ", isLink: false }, { text: t('and'), isLink: false }, { text: "Firebase Studio", isLink: true, link: { href: "https://firebase.studio/", text: "Firebase Studio" } } ]},
      pt: { line: [ { text: `${t('madeBy')} `, isLink: false }, { text: "Maxim Bortnikov", isLink: true, link: { href: "https://maxim-bortnikov.netlify.app/", text: "Maxim Bortnikov" } }, { text: ` ${t('using')} `, isLink: false }, { text: "Next.js", isLink: true, link: { href: "https://nextjs.org/", text: "Next.js" } }, { text: ", ", isLink: false }, { text: "Perplexity", isLink: true, link: { href: "https://www.perplexity.ai/", text: "Perplexity" } }, { text: ", ", isLink: false }, { text: t('and'), isLink: false }, { text: "Firebase Studio", isLink: true, link: { href: "https://firebase.studio/", text: "Firebase Studio" } } ]},
      yue: { line: [ { text: `${t('madeBy')} `, isLink: false }, { text: "Maxim Bortnikov", isLink: true, link: { href: "https://maxim-bortnikov.netlify.app/", text: "Maxim Bortnikov" } }, { text: ` ${t('using')} `, isLink: false }, { text: "Next.js", isLink: true, link: { href: "https://nextjs.org/", text: "Next.js" } }, { text: ", ", isLink: false }, { text: "Perplexity", isLink: true, link: { href: "https://www.perplexity.ai/", text: "Perplexity" } }, { text: ", ", isLink: false }, { text: t('and'), isLink: false }, { text: "Firebase Studio", isLink: true, link: { href: "https://firebase.studio/", text: "Firebase Studio" } } ]},
      ja: { line: [ { text: `${t('madeBy')} `, isLink: false }, { text: "Maxim Bortnikov", isLink: true, link: { href: "https://maxim-bortnikov.netlify.app/", text: "Maxim Bortnikov" } }, { text: ` ${t('using')} `, isLink: false }, { text: "Next.js", isLink: true, link: { href: "https://nextjs.org/", text: "Next.js" } }, { text: ", ", isLink: false }, { text: "Perplexity", isLink: true, link: { href: "https://www.perplexity.ai/", text: "Perplexity" } }, { text: ", ", isLink: false }, { text: t('and'), isLink: false }, { text: "Firebase Studio", isLink: true, link: { href: "https://firebase.studio/", text: "Firebase Studio" } } ]},
      de: { line: [ { text: `${t('madeBy')} `, isLink: false }, { text: "Maxim Bortnikov", isLink: true, link: { href: "https://maxim-bortnikov.netlify.app/", text: "Maxim Bortnikov" } }, { text: ` ${t('using')} `, isLink: false }, { text: "Next.js", isLink: true, link: { href: "https://nextjs.org/", text: "Next.js" } }, { text: ", ", isLink: false }, { text: "Perplexity", isLink: true, link: { href: "https://www.perplexity.ai/", text: "Perplexity" } }, { text: ", ", isLink: false }, { text: t('and'), isLink: false }, { text: "Firebase Studio", isLink: true, link: { href: "https://firebase.studio/", text: "Firebase Studio" } } ]},
      fr: { line: [ { text: `${t('madeBy')} `, isLink: false }, { text: "Maxim Bortnikov", isLink: true, link: { href: "https://maxim-bortnikov.netlify.app/", text: "Maxim Bortnikov" } }, { text: ` ${t('using')} `, isLink: false }, { text: "Next.js", isLink: true, link: { href: "https://nextjs.org/", text: "Next.js" } }, { text: ", ", isLink: false }, { text: "Perplexity", isLink: true, link: { href: "https://www.perplexity.ai/", text: "Perplexity" } }, { text: ", ", isLink: false }, { text: t('and'), isLink: false }, { text: "Firebase Studio", isLink: true, link: { href: "https://firebase.studio/", text: "Firebase Studio" } } ]},
      ko: { line: [ { text: `${t('madeBy')} `, isLink: false }, { text: "Maxim Bortnikov", isLink: true, link: { href: "https://maxim-bortnikov.netlify.app/", text: "Maxim Bortnikov" } }, { text: ` ${t('using')} `, isLink: false }, { text: "Next.js", isLink: true, link: { href: "https://nextjs.org/", text: "Next.js" } }, { text: ", ", isLink: false }, { text: "Perplexity", isLink: true, link: { href: "https://www.perplexity.ai/", text: "Perplexity" } }, { text: ", ", isLink: false }, { text: t('and'), isLink: false }, { text: "Firebase Studio", isLink: true, link: { href: "https://firebase.studio/", text: "Firebase Studio" } } ]},
      vi: { line: [ { text: `${t('madeBy')} `, isLink: false }, { text: "Maxim Bortnikov", isLink: true, link: { href: "https://maxim-bortnikov.netlify.app/", text: "Maxim Bortnikov" } }, { text: ` ${t('using')} `, isLink: false }, { text: "Next.js", isLink: true, link: { href: "https://nextjs.org/", text: "Next.js" } }, { text: ", ", isLink: false }, { text: "Perplexity", isLink: true, link: { href: "https://www.perplexity.ai/", text: "Perplexity" } }, { text: ", ", isLink: false }, { text: t('and'), isLink: false }, { text: "Firebase Studio", isLink: true, link: { href: "https://firebase.studio/", text: "Firebase Studio" } } ]},
      pl: { line: [ { text: `${t('madeBy')} `, isLink: false }, { text: "Maxim Bortnikov", isLink: true, link: { href: "https://maxim-bortnikov.netlify.app/", text: "Maxim Bortnikov" } }, { text: ` ${t('using')} `, isLink: false }, { text: "Next.js", isLink: true, link: { href: "https://nextjs.org/", text: "Next.js" } }, { text: ", ", isLink: false }, { text: "Perplexity", isLink: true, link: { href: "https://www.perplexity.ai/", text: "Perplexity" } }, { text: ", ", isLink: false }, { text: t('and'), isLink: false }, { text: "Firebase Studio", isLink: true, link: { href: "https://firebase.studio/", text: "Firebase Studio" } } ]},
      cs: { line: [ { text: `${t('madeBy')} `, isLink: false }, { text: "Maxim Bortnikov", isLink: true, link: { href: "https://maxim-bortnikov.netlify.app/", text: "Maxim Bortnikov" } }, { text: ` ${t('using')} `, isLink: false }, { text: "Next.js", isLink: true, link: { href: "https://nextjs.org/", text: "Next.js" } }, { text: ", ", isLink: false }, { text: "Perplexity", isLink: true, link: { href: "https://www.perplexity.ai/", text: "Perplexity" } }, { text: ", ", isLink: false }, { text: t('and'), isLink: false }, { text: "Firebase Studio", isLink: true, link: { href: "https://firebase.studio/", text: "Firebase Studio" } } ]},
      hu: { line: [ { text: `${t('madeBy')} `, isLink: false }, { text: "Maxim Bortnikov", isLink: true, link: { href: "https://maxim-bortnikov.netlify.app/", text: "Maxim Bortnikov" } }, { text: ` ${t('using')} `, isLink: false }, { text: "Next.js", isLink: true, link: { href: "https://nextjs.org/", text: "Next.js" } }, { text: ", ", isLink: false }, { text: "Perplexity", isLink: true, link: { href: "https://www.perplexity.ai/", text: "Perplexity" } }, { text: ", ", isLink: false }, { text: t('and'), isLink: false }, { text: "Firebase Studio", isLink: true, link: { href: "https://firebase.studio/", text: "Firebase Studio" } } ]},
      nl: { line: [ { text: `${t('madeBy')} `, isLink: false }, { text: "Maxim Bortnikov", isLink: true, link: { href: "https://maxim-bortnikov.netlify.app/", text: "Maxim Bortnikov" } }, { text: ` ${t('using')} `, isLink: false }, { text: "Next.js", isLink: true, link: { href: "https://nextjs.org/", text: "Next.js" } }, { text: ", ", isLink: false }, { text: "Perplexity", isLink: true, link: { href: "https://www.perplexity.ai/", text: "Perplexity" } }, { text: ", ", isLink: false }, { text: t('and'), isLink: false }, { text: "Firebase Studio", isLink: true, link: { href: "https://firebase.studio/", text: "Firebase Studio" } } ]},
  };

  const renderTextParts = (parts: TextPart[]) =>
    parts.map((part, index) => {
      if (part.isLink && part.link) {
        return (
          <a
            key={index}
            href={part.link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {part.link.text}
          </a>
        );
      }
      return <span key={index}>{part.text}</span>;
    });

  const currentLangStrings =
    madeByText[locale as keyof typeof madeByText] || madeByText.en;

  return (
    <footer className="text-center text-muted-foreground mt-8 py-10 border-t border-[#242424] flex flex-col items-center gap-6">
      <div className="h-[22px]" />

      <NamerUiBadge
        isRTL={locale === "he"}
        poweredByText={t("poweredBy")}
        namerUIName={t("namerUi")}
      />

      {/* Verified Tools badge – natural width */}
      <a
        href={verifiedToolsLogoLoaded ? "https://www.verifiedtools.info" : undefined}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex",
          justifyContent: "center",
          alignItems: "center",
          textDecoration: "none",
          pointerEvents: verifiedToolsLogoLoaded ? "auto" : "none",
        }}
      >
        <img
          src="https://www.verifiedtools.info/badge.png"
          alt={verifiedToolsLogoLoaded ? "Verified on Verified Tools" : ""}
          loading="lazy"
          onLoad={() => setVerifiedToolsLogoLoaded(true)}
          onError={() => setVerifiedToolsLogoLoaded(false)}
          style={{
            opacity: verifiedToolsLogoLoaded ? 1 : 0.01,
            height: verifiedToolsLogoLoaded ? "68px" : "1px",
            width: "auto", // natural width
            objectFit: "contain",
            transition: "opacity 0.2s ease-out",
          }}
        />
      </a>

      {/* Aura++ badge – no outline, auto width */}
      <a
        href={
          auraPlusPlusLogoLoaded
            ? "https://auraplusplus.com/projects/nof"
            : undefined
        }
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex",
          justifyContent: "center",
          alignItems: "center",
          textDecoration: "none",
          pointerEvents: auraPlusPlusLogoLoaded ? "auto" : "none",
        }}
      >
        <img
          src="https://auraplusplus.com/images/badges/featured-on-light.svg"
          alt={auraPlusPlusLogoLoaded ? "Featured on Aura++" : ""}
          loading="lazy"
          onLoad={() => setAuraPlusPlusLogoLoaded(true)}
          onError={() => setAuraPlusPlusLogoLoaded(false)}
          style={{
            borderRadius: 6,
            opacity: auraPlusPlusLogoLoaded ? 1 : 0.01,
            height: auraPlusPlusLogoLoaded ? "54px" : "1px",
            width: "auto", // natural width, since original badge has no fixed width
            objectFit: "contain",
            transition: "opacity 0.2s ease-out",
          }}
        />
      </a>

      {/* Twelve Tools badge – natural width */}
      <a
        href={twelveToolsLogoLoaded ? "https://twelve.tools" : undefined}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex",
          justifyContent: "center",
          alignItems: "center",

          textDecoration: "none",
          pointerEvents: twelveToolsLogoLoaded ? "auto" : "none",
        }}
      >
        <img
          src="https://twelve.tools/badge0-dark.svg"
          alt={twelveToolsLogoLoaded ? "Featured on Twelve Tools" : ""}
          width={200}
          height={54}
          loading="lazy"
          onLoad={() => setTwelveToolsLogoLoaded(true)}
          onError={() => setTwelveToolsLogoLoaded(false)}
          style={{
            borderRadius: 6,
            opacity: twelveToolsLogoLoaded ? 1 : 0.01,
            height: twelveToolsLogoLoaded ? "54px" : "1px",
            width: "auto",
            objectFit: "contain",
            transition: "opacity 0.2s ease-out",
          }}
        />
      </a>

      {/* Product Hunt badge (no href until loaded, subtle border only after load) */}
      <a
        href={
          productHuntLoaded
            ? "https://www.producthunt.com/products/nof?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-nof"
            : undefined
        }
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex",
          justifyContent: "center",
          alignItems: "center",
          textDecoration: "none",
          pointerEvents: productHuntLoaded ? "auto" : "none",
          borderRadius: 6,
          transition: "border-color 0.2s ease-out",
        }}
      >
        <img
          src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1032819&theme=light&t=1761884417200"
          alt={
            productHuntLoaded
              ? "Nof - Color palette generator | Product Hunt"
              : ""
          }
          width={250}
          height={54}
          loading="lazy"
          onLoad={() => setProductHuntLoaded(true)}
          onError={() => setProductHuntLoaded(false)}
          style={{
            height: productHuntLoaded ? "54px" : "1px",
            width: "auto",
            borderRadius: 6,
            opacity: productHuntLoaded ? 1 : 0.01,
            objectFit: "contain",
            transition: "opacity 0.2s ease-out",
          }}
        />
      </a>
      {locale === 'he' ? (
        <>
          <p className="break-words px-4 text-right" dir="rtl">
            {renderTextParts((madeByText.he as { line: TextPart[]; line2: TextPart[] }).line)}
          </p>
          <p className="break-words px-4 text-right mt-[-18px]" dir="rtl">
            {renderTextParts((madeByText.he as { line: TextPart[]; line2: TextPart[] }).line2)}
          </p>
        </>
      ) : (
      <p className="break-words px-4">
        {renderTextParts(currentLangStrings.line)}
      </p>
      )}
      <div className="h-[22px]" />
    </footer>
  );
}