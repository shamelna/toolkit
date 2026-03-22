import type { Metadata } from 'next';
import { Noto_Serif_JP, DM_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const displayFont = Noto_Serif_JP({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-display',
  display: 'swap',
});

const bodyFont = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-body',
  display: 'swap',
});

const monoFont = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Kaizen Sensei — Your Continuous Improvement Guide',
  description: 'Ask the Kaizen Sensei anything about Lean, TPS, and continuous improvement.',
  icons: {
    icon: 'http://practitioner.kaizenacademy.education/Tcia.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable}`}>
      <body className="font-body bg-kaizen-dark text-white antialiased">
        {children}
      </body>
    </html>
  );
}
