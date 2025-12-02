import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { AppShell } from '@/components/AppShell';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Personal Safety Guardian',
  description: 'Analyze images, videos, audio, and text for safety threats',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <body className={inter.className}>
        <AppShell>{children}</AppShell>
        <div id="command-center-portal" />
      </body>
    </html>
  );
}

