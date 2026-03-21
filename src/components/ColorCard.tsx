
'use client';
import React, { useEffect, useState } from 'react';
import { Copy } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { useToast } from '@/hooks/use-toast';

type ValidationBadgeProps = {
  show?: boolean;
  ratio: number;
  ratioLimit: number;
  trueForeground?: string;
  trueBackground?: string;
  trueBorderColor?: string;
  falseForeground?: string;
  falseBackground?: string;
  falseBorderColor?: string;
  paddingX?: string;
  paddingY?: string;
  gapIconText?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

const ValidationBadge = ({
  show = true,
  ratio,
  ratioLimit,
  children,
  trueForeground = 'hsl(var(--accent))',
  trueBackground = '#002030',
  trueBorderColor = '#00334D',
  falseForeground = '#aaa',
  falseBackground = 'transparent',
  falseBorderColor = 'var(--border-color)',
  paddingX = '8px',
  paddingY = '2px',
  gapIconText = 4,
  style,
}: ValidationBadgeProps) => {
  if (!show) return null;
  const passed = ratio >= ratioLimit;
  const badgeStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: gapIconText,
    borderRadius: 100,
    padding: `${paddingY} ${paddingX}`,
    fontSize: 12,
    fontWeight: 500,
    userSelect: 'none',
    whiteSpace: 'nowrap',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: passed ? trueBorderColor : falseBorderColor,
    backgroundColor: passed ? trueBackground : falseBackground,
    color: passed ? trueForeground : falseForeground,
    transition: 'all 0.3s ease',
    ...style,
  };

  const iconColor = passed ? trueForeground : falseForeground;

  return (
    <span style={badgeStyles}>
      {passed ? (
        <svg width="14" height="14" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg width="14" height="14" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" viewBox="0 0 24 24">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      )}
      {children}
    </span>
  );
};

type ColorCardProps = {
  hexColor: string;
  onCopy?: (color: string) => void;
  isRTL?: boolean;
  percentageTagValue?: string;
  showPercentageTag?: boolean;
};

export default function ColorCard({
  hexColor,
  onCopy,
  isRTL = false,
  percentageTagValue,
  showPercentageTag = false,
}: ColorCardProps) {
  const { t, locale } = useTranslation();
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  const [contrast, setContrast] = useState<number | null>(null);

  useEffect(() => {
    try {
      const hexToRgb = (hex: string) => {
        const h = hex.replace('#', '');
        return {
          r: parseInt(h.slice(0, 2), 16),
          g: parseInt(h.slice(2, 4), 16),
          b: parseInt(h.slice(4, 6), 16),
        };
      };
      const { r, g, b } = hexToRgb(hexColor);
      const toLuminance = (c: number) => {
        const s = c / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
      };
      const L = 0.2126 * toLuminance(r) + 0.7152 * toLuminance(g) + 0.0722 * toLuminance(b);
      const ratio = (L + 0.05) / 0.05;
      setContrast(Number(ratio.toFixed(2)));
    } catch {
      setContrast(null);
    }
  }, [hexColor]);

  const handleCopy = async () => {
    const colorToCopy = hexColor.toUpperCase();

    try {
      // Use secure Clipboard API only on allowed environments
      if (navigator?.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(colorToCopy);
      } else {
        // Fallback for insecure contexts or Chrome blocking
        const textarea = document.createElement('textarea');
        textarea.value = colorToCopy;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      toast({
        title: t('appName'),
        description: t('copySuccess'),
      });
      onCopy?.(colorToCopy);
    } catch (error) {
      toast({
        title: t('appName'),
        description: t('copyError'),
      });
    }
  };

  return (
    <div
      style={{
        background: '#000',
        borderColor: 'var(--border-color)',
        borderWidth: 1,
        borderRadius: 'var(--radius)',
        padding: '12px',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        color: 'hsl(var(--foreground))',
        userSelect: 'none',
        direction: isRTL ? 'rtl' : 'ltr',
        width: '100%',
        boxSizing: 'border-box',
        position: 'relative',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{
        position: 'absolute',
        bottom: '12px',
        display: 'flex',
        flexDirection: 'row',
        gap: 6,
        zIndex: 10,
        [isRTL ? 'left' : 'right']: '12px',
      }}>
        <ValidationBadge ratio={contrast ?? 0} ratioLimit={4.5}>AA</ValidationBadge>
        <ValidationBadge ratio={contrast ?? 0} ratioLimit={7}>AAA</ValidationBadge>
      </div>

      <div style={{
        height: '6rem',
        backgroundColor: hexColor,
        borderColor: 'var(--border-color)',
        borderWidth: 1,
        borderRadius: 'var(--radius)',
        borderStyle: 'solid',
        position: 'relative',
        transition: 'all 0.3s ease',
      }}>
        {showPercentageTag && (
          <div style={{
            position: 'absolute',
            top: '0.5rem',
            [isRTL ? 'right' : 'left']: '0.5rem',
            background: 'rgba(0,0,0,0.4)',
            color: '#fff',
            fontSize: '0.75rem',
            padding: '4px 7px',
            borderRadius: 100,
            lineHeight: 1,
            pointerEvents: 'none',
          }}>
            {percentageTagValue}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-8 flex-row">
        <code 
          className="font-mono text-[0.875rem] font-medium text-[hsl(var(--foreground))] uppercase" 
          style={{ direction: 'ltr', textAlign: isRTL ? 'right' : 'left', flex: 1 }}
        >
          {hexColor.toUpperCase()}
        </code>

        <button
          onClick={handleCopy}
          style={{
            width: 28,
            height: 28,
            background: isHovered ? 'hsl(var(--primary))' : 'hsl(var(--foreground))',
            color: isHovered ? 'hsl(var(--foreground))' : '#000',
            borderRadius: 'var(--radius)',
            border: 'none',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          <Copy size={16} />
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
        <div style={{
          width: 40,
          height: 40,
          backgroundColor: hexColor,
          borderColor: 'var(--border-color)',
          borderWidth: 1,
          borderRadius: 'var(--radius)',
          borderStyle: 'solid',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <span style={{ color: '#fff', fontSize: '1rem', fontWeight: 500 }}>
            {locale === 'he' ? 'ל' : 'A'}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ color: '#737373', fontSize: '12px', fontWeight: 700 }}>{t('contrastRatio')}</span>
          <span style={{ color: 'hsl(var(--foreground))', fontSize: '14px', fontWeight: 400 }}>
            {isRTL ? `1:${contrast?.toFixed(2) ?? '--'}` : `${contrast?.toFixed(2) ?? '--'}:1`}
          </span>
        </div>
      </div>
    </div>
  );
}
