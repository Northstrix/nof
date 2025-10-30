'use client';
import { useMemo } from 'react';
import { ColorCard } from './color-card';
import { useIsMobile } from '@/hooks/use-mobile';
import { v4 as uuidv4 } from 'uuid';

interface PalettesProps {
  harmonies: {
    [key: string]: string[];
  };
  activeMode: string;
}

export function Palettes({ harmonies, activeMode }: PalettesProps) {
  const isMobile = useIsMobile();

  const colors = useMemo(() => {
    return harmonies[activeMode] || [];
  }, [activeMode, harmonies]);

  // Generate stable UUIDs only when colors array changes
  // Map color to { color, id } so keys are stable but unique per color change
  const colorsWithIds = useMemo(() => {
    return colors.map((color) => ({
      color,
      id: uuidv4(),
    }));
  }, [colors]);

  if (!colorsWithIds || colorsWithIds.length === 0) {
    return <div className="text-muted-foreground">{/* Invalid color input */}</div>;
  }

  const minCardWidth = isMobile ? 296 : 316;

  return (
    <div
      className="grid gap-3"
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(${minCardWidth}px, 1fr))`,
      }}
    >
      {colorsWithIds.map(({ color, id }) => (
        <ColorCard key={id} hexColor={color} />
      ))}
    </div>
  );
}
