// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Suspense } from 'react';
import { LanguageProvider } from '@/components/LanguageProvider'; // or just '@/components'

export const metadata: Metadata = {
  title: 'Nof',
  description: 'A modern color palette generator that makes it possible to create a complete color palette from just one base color.',
  icons: {
    icon: [
      {
        rel: 'icon',
        url: '/logo.png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased bg-[hsl(var(--background))] selection:bg-primary selection:text-white">
        <Suspense fallback={null}>
          <LanguageProvider>{children}</LanguageProvider>
        </Suspense>
        <Toaster />
      </body>
    </html>
  );
}
