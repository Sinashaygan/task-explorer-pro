import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";

import { AppProviders } from "./providers";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
});

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
      <body className={vazirmatn.variable}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
