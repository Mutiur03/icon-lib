import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Technology Icon Library | Same-Domain Icons for Developers",
  description: "A centralized, theme-aware technology icon registry for developer portfolios, READMEs, and web projects. Seamlessly switches between light and dark modes.",
  keywords: [
    "technology icons",
    "developer portfolio icons",
    "svg icons for github readme",
    "theme aware icons",
    "tech stack badges",
    "skills icons",
    "programming language logos",
    "framework icons",
    "dark mode readme icons",
    "icon proxy api"
  ],
  authors: [{ name: "IconLib Team" }],
  metadataBase: new URL("https://icon-lib-nu.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Technology Icon Library | Same-Domain Icons for Developers",
    description: "Centralized, theme-aware technology icon registry for developer portfolios, READMEs, and web projects. Automatically adapts to light/dark themes.",
    url: "https://icon-lib-nu.vercel.app",
    siteName: "IconLib",
    images: [
      {
        url: "/api/icons/react", // Use React icon as a fallback branding preview image
        width: 128,
        height: 128,
        alt: "Technology Icon Library Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Technology Icon Library | Same-Domain Icons for Developers",
    description: "Centralized, theme-aware technology icon registry for developer portfolios, READMEs, and web projects.",
    images: ["/api/icons/react"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">{children}</body>
    </html>
  );
}
