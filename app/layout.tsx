import type { Metadata } from 'next';
import './globals.css';
import ThemeProvider from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'RedHill Inventory Dashboard',
  description: 'Retail inventory management system for Singapore Central Mall',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-50 dark:bg-gray-900" suppressHydrationWarning>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
