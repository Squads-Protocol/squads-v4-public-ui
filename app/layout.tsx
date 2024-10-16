import type { Metadata } from "next";
import "./globals.css";
import { SolanaProvider } from "@/providers/SolanaProvider";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Squads Simplified",
  description: "Squads v4 program user interface.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const rpcUrl = headers().get("x-rpc-url");
  return (
    <html lang="en">
      <SolanaProvider rpc={rpcUrl}>{children}</SolanaProvider>
    </html>
  );
}
