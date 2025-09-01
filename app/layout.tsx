import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import SessionProvider from '@/components/providers/session-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { SocketProvider } from '@/components/providers/socket-provider';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Smart Event Scheduler - AI-Powered Calendar Management',
  description: 'Transform your calendar management with AI-powered scheduling, real-time collaboration, and intelligent conflict resolution.',
  keywords: 'calendar, scheduling, AI, collaboration, events, meetings',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <SocketProvider>
              {children}
              <Toaster richColors position="top-right" />
            </SocketProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}