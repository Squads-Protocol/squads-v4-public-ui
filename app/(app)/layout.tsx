"use client";

import Link from "next/link";
import Image from "next/image";
import { Toaster } from "@/components/ui/sonner";
import ConnectWallet from "@/components/ConnectWalletButton";
import {
  LucideHome,
  ArrowDownUp,
  Users,
  Settings,
  CheckSquare,
  AlertTriangle,
} from "lucide-react";
import RenderMultisigRoute from "@/components/RenderMultisigRoute";
import { usePathname } from 'next/navigation';
import { QueryClient } from '@tanstack/query-core';
import { QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const queryClient = new QueryClient();

const AppLayout =  ({ children }: { children: React.ReactNode }) => {
  const tabs = [
    {
      name: "Home",
      icon: <LucideHome />,
      route: "/",
    },
    {
      name: "Transactions",
      icon: <ArrowDownUp />,
      route: "/transactions/",
    },
    {
      name: "Configuration",
      icon: <Users />,
      route: "/config/",
    },
    {
      name: "Settings",
      icon: <Settings />,
      route: "/settings/",
    },
  ];

  const path = usePathname();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col md:flex-row h-screen min-w-full bg-white">
        <aside
          id="sidebar"
          className="hidden md:block md:left-0 md:top-0 md:w-3/12 lg:w-3/12 z-40 h-auto md:h-screen md:fixed"
          aria-label="Sidebar"
        >
          <div className="flex h-auto md:h-full flex-col overflow-y-auto justify-between md:border-r border-slate-200 px-3 py-4  bg-slate-200">
            <div>
              {" "}
              <Link href="/">
                <div className="mb-10 flex items-center rounded-lg px-3 py-2 text-slate-900 dark:text-white">
                  <Image
                    src="/logo.png"
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: "150px", height: "auto" }}
                    alt="Mercure Logo"
                    unoptimized
                  />
                </div>
              </Link>
              <ul className="space-y-2 text-sm font-medium">
                {tabs.map((tab) => (
                  <li key={tab.route}>
                    <a
                      href={tab.route}
                      className={`flex items-center rounded-lg px-4 py-3 text-slate-900 
                    
        ${
          (path!.startsWith(`${tab.route}/`) && tab.route != "/") ||
          tab.route === path
            ? "bg-slate-400"
            : "hover:bg-slate-400"
        }`}
                    >
                      {tab.icon}
                      <span className="ml-3 flex-1 whitespace-nowrap text-base text-black">
                        {tab.name}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <ConnectWallet />
          </div>
        </aside>

        <aside
          id="mobile-navbar"
          className="block md:hidden inset-x-0 bottom-0 z-50 bg-slate-20 p-2 fixed bg-slate-300"
          aria-label="Mobile navbar"
        >
          <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium mt-1 ">
            {tabs.map((tab) => (
              <Link href={tab.route} key={tab.route}>
                <button
                  type="button"
                  className="inline-flex flex-col items-center justify-center px-5 hover:bg-slate-400 rounded-md py-2 group"
                >
                  {tab.icon}
                  <span className="flex-1 whitespace-nowrap text-sm text-slate-900">
                    {tab.name}
                  </span>
                </button>
              </Link>
            ))}
          </div>
        </aside>
        <ErrorBoundary>
          <RenderMultisigRoute children={children} />
        </ErrorBoundary>
      </div>
      <Toaster
        expand
        visibleToasts={3}
        icons={{
          error: <AlertTriangle className="w-4 h-4 text-red-600" />,
          success: <CheckSquare className="w-4 h-4 text-green-600" />,
        }}
      />
    </QueryClientProvider>
  );
};

export default AppLayout;
