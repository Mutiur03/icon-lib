import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Technology Icon Library",
  description: "Centralized technology icon registry for portfolio projects."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
