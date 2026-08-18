import type { Metadata } from "next";

import { AppProviders } from "./providers";

export const metadata: Metadata = {
  title: "Kanban Board",
  description: "Professional Kanban Board built with Next.js and Redux Toolkit",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fa">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
