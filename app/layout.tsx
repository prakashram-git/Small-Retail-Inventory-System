import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RedHill Inventory Dashboard',
  description: 'Retail inventory management system for Singapore Central Mall',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-50" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
