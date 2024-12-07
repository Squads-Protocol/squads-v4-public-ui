"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarBody,
  SidebarButton,
  SidebarLink,
} from "../ui/primitives/aside";
import { usePathname } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Code2,
  Home,
  PlugIcon,
  Receipt,
  Settings,
  Unplug,
  Users,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { getRandomAvatar } from "@/lib/helpers/getAvatar";
import ConnectButton from "./wallet/connect-button";
import WalletMenu from "./wallet/connected-state";
import { useCluster } from "@/state/ClusterContext";

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { connected, disconnect, wallet, publicKey } = useWallet();
  const { cluster } = useCluster();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const links = [
    {
      label: "Home",
      href: "/",
      icon: (
        <Home
          strokeWidth={1}
          className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"
        />
      ),
    },
    {
      label: "Transactions",
      href: "/transactions?page=1",
      icon: (
        <Receipt
          strokeWidth={1}
          className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"
        />
      ),
    },
    {
      label: "Developers",
      href: "/developers",
      icon: (
        <Code2
          strokeWidth={1}
          className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"
        />
      ),
    },
    {
      label: "Config",
      href: "/config",
      icon: (
        <Users
          strokeWidth={1}
          className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"
        />
      ),
    },
    {
      label: "Settings",
      href: "/settings",
      icon: (
        <Settings
          strokeWidth={1}
          className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"
        />
      ),
    },
  ];
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row dark:bg-darkforeground w-full flex-1 max-h-screen mx-auto overflow-hidden"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="relative justify-between gap-16 h-screen border-r border-neutral-200 dark:border-darkborder/10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-4">
              {links.map((link, idx) => (
                <SidebarLink
                  className={`font-neue p-1 rounded-md ${pathname == link.href ? "bg-stone-500/50" : ""
                    }`}
                  key={idx}
                  link={link}
                />
              ))}
            </div>
          </div>
          {connected ? (
            <div className="flex gap-2 items-center justify-between">
              {/*<WalletMenu open={modalOpen} setOpen={setModalOpen} />*/}
              <SidebarButton
                className="font-neuemedium"
                button={{
                  label:
                    publicKey?.toString().slice(0, 4) +
                    "..." +
                    publicKey?.toString().slice(-4) || "????",
                  onClick: () => { },
                  icon: (
                    <span className="relative inline-flex">
                      <Image
                        alt="Wallet"
                        width={100}
                        height={100}
                        src={
                          wallet?.adapter.icon ??
                          getRandomAvatar(publicKey?.toString() as string)
                        }
                        className="size-6 rounded-md flex-shrink-0 rounded-full"
                      />
                      <span className="absolute bottom-0 right-0 block translate-x-1/2 translate-y-1/2 transform rounded-full border-2 border-darkbackground">
                        <Image
                          alt="Cluster"
                          src={cluster?.includes("solana")
                            ? "/assets/solana.svg"
                            : cluster?.includes("eclipse")
                              ? "/assets/eclipse.svg"
                              : "/assets/default_image_light.svg"
                          }
                          width={20}
                          height={20}
                          className="block size-2 flex-shrink-0 rounded-full"
                        />
                      </span>
                    </span>
                  ),
                }}
              />
              <Unplug
                onClick={disconnect}
                strokeWidth={1}
                className={`text-stone-300 hover:text-stone-100 h-5 w-5 ${!open && "hidden"
                  }`}
              />
            </div>
          ) : (
            <>
              {open ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{
                    delay: 0.1,
                    duration: 0.2,
                    ease: "easeInOut",
                  }}
                  className="w-full"
                >
                  <ConnectButton />
                </motion.div>
              ) : (
                <PlugIcon
                  onClick={disconnect}
                  strokeWidth={1}
                  className={`text-stone-300 hover:text-stone-100 h-5 w-5`}
                />
              )}
            </>
          )}
        </SidebarBody>
      </Sidebar>
      <div className="w-full overflow-y-scroll">{children}</div>
    </div>
  );
}
export const Logo = () => {
  const { theme } = useTheme();
  const logo = theme == "dark" ? "/assets/squads-light.png" : "/assets/logo.svg";

  return (
    <Link
      href="#"
      className="ml-1 font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <motion.img
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        src={logo}
        className="h-5"
      />
    </Link>
  );
};
export const LogoIcon = () => {
  const { theme } = useTheme();
  const logo = theme == "dark" ? "/assets/squads-light.png" : "/assets/logo.svg";

  return (
    <Link
      href="#"
      className="ml-1 font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <img src="./assets/squads-icon.svg" className="h-5 w-6-sm flex-shrink-0" />
    </Link>
  );
};
