import { headers } from "next/headers";
import "./globals.css";
import type { Metadata } from "next";
import { SolanaProvider } from "@/providers/SolanaProvider";
import { ThemeProvider } from "next-themes";
import SidebarLayout from "@/components/layout/dashboard";
import WrapperProvider from "@/state/ContextWrapper";

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
  const rpcUrl = headers().get("x-rpc-url");

  return (
    <html lang="en">
      <body>
        <SolanaProvider rpc={rpcUrl}>
          <WrapperProvider rpcUrl={rpcUrl}>
            <ThemeProvider defaultTheme="dark" attribute="class">
              <SidebarLayout>{children}</SidebarLayout>
            </ThemeProvider>
          </WrapperProvider>
        </SolanaProvider>
      </body>
    </html>
  );
}
