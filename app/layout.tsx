import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Wallet } from "@/components/Wallet";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Squads Simplified",
  description:
    "Squads v4 program user interface.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Wallet>
        <body className={inter.className}>{children}</body>
      </Wallet>
    </html>
  );
}
