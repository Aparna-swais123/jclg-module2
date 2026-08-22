import type { Metadata } from 'next';
import '../index.css';

export const metadata: Metadata = {
  title: 'Student Welfare Dashboard',
  description: 'Student welfare dashboard',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
