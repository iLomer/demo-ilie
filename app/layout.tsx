import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { SiteFooter } from "@/app/components/site-footer";

export const metadata: Metadata = {
  title: "demo-ilie",
  description: "Fabrica project — iLomer/demo-ilie",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
