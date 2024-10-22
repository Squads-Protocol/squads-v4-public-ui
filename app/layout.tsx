import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Squads Simplified",
  description: "Squads v4 program user interface.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
