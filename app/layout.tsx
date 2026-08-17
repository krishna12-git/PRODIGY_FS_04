import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Circlo Social",
  description: "A friendly social space to share moments and find your people.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
