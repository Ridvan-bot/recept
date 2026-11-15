import type { Metadata, Viewport } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import { BottomNav } from "@/components/BottomNav";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
});

const body = Source_Sans_3({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: {
    default: "Recept",
    template: "%s · Recept",
  },
  description: "Hushållets recept — enkla att laga från mobilen.",
  applicationName: "Recept",
  appleWebApp: {
    capable: true,
    title: "Recept",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#c24e1d",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv">
      <body className={`${display.variable} ${body.variable}`}>
        <div className="shell">{children}</div>
        <BottomNav />
      </body>
    </html>
  );
}
