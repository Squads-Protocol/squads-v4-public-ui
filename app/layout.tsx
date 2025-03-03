'use client';
import Head from 'next/head';
import { Inter } from 'next/font/google';
import './globals.css';
import { Wallet } from '@/components/Wallet';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <Head>
        <title>Squads Simplified</title>
        <meta name="description" content="Squads v4 program user interface." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Wallet>
        <body>{children}</body>
      </Wallet>
    </html>
  );
}
