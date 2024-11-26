"use client";
import Image from "next/image";
import Link from "next/link";
import ConnectButton from "./wallet/connect-button";
import Pill from "../ui/pill";
import { usePathname } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { useTheme } from "next-themes";
import LightDarkButton from "./light-dark-button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/primitives/tooltip";
import { SquadMetadata } from "@/lib/types";

export default function Header({
  multisig,
  cluster,
  metadata,
}: {
  multisig: string | null;
  cluster: string | null;
  metadata: SquadMetadata | null;
}) {
  const pathname = usePathname();
  const { connected } = useWallet();
  const { theme } = useTheme();

  const logo = theme == "dark" ? "/squads-light.png" : "/logo.svg";

  return (
    <>
      <div className="fixed w-full bg-lightbackground/25 dark:bg-darkbackground/25 backdrop-blur-2xl z-[50] border border-transparent border-b-stone-300/75 dark:border-b-stone-800">
        <div className="w-full h-fit flex justify-between items-center py-3 px-6">
          <Link href="https://app.squads.so/" passHref>
            <Image src={logo} alt="" width={100} height={50} className="w-32" />
          </Link>
          <div className="flex gap-10 items-center">
            <div className="flex gap-4 items-center">
              <Link
                href={`/`}
                className={`text-sm py-2 px-3 font-neue rounded-lg text-stone-700 hover:bg-stone-300/50 dark:text-stone-50 dark:hover:bg-white/[0.03] ${
                  pathname == "/" && "bg-stone-300/50 dark:bg-white/[0.03]"
                }`}
              >
                Home
              </Link>
              <Link
                href={`/transactions`}
                className={`text-sm py-2 px-3 font-neue rounded-lg text-stone-700 hover:bg-stone-300/50 dark:text-stone-50 dark:hover:bg-white/[0.03] ${
                  pathname == "/transactions" &&
                  "bg-stone-300/50 dark:bg-white/[0.03]"
                }`}
              >
                Transactions
              </Link>
              <Link
                href={`/developers`}
                className={`text-sm py-2 px-3 font-neue rounded-lg text-stone-700 hover:bg-stone-300/50 dark:text-stone-50 dark:hover:bg-white/[0.03] ${
                  pathname == "/config" &&
                  "bg-stone-300/50 dark:bg-white/[0.03]"
                }`}
              >
                Developers
              </Link>
              <Link
                href={`/config`}
                className={`text-sm py-2 px-3 font-neue rounded-lg text-stone-700 hover:bg-stone-300/50 dark:text-stone-50 dark:hover:bg-white/[0.03] ${
                  pathname == "/config" &&
                  "bg-stone-300/50 dark:bg-white/[0.03]"
                }`}
              >
                Config
              </Link>
              <Link
                href={`/settings`}
                className={`text-sm py-2 px-3 font-neue rounded-lg text-stone-700 hover:bg-stone-300/50 dark:text-stone-50 dark:hover:bg-white/[0.03] ${
                  pathname == "/settings" &&
                  "bg-stone-300/50 dark:bg-white/[0.03]"
                }`}
              >
                Settings
              </Link>
            </div>
            <div className="flex gap-4 items-center">
              <div className="flex gap-3 items-center">
                {connected && multisig && (
                  <TooltipProvider>
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger>
                        <Pill
                          label={
                            metadata?.name
                              ? metadata.name
                              : multisig.slice(0, 4) +
                                "..." +
                                multisig.slice(-4)
                          }
                          image={
                            metadata?.imageUri || "/default_image_light.svg"
                          }
                        />
                      </TooltipTrigger>
                      <TooltipContent className="bg-lightbackground dark:bg-darkbackground border border-border/30 dark:border-darkborder/10">
                        <p className="font-neue text-xs text-stone-700 dark:text-stone-50">
                          Selected Squad
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                {cluster && (
                  <TooltipProvider>
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger>
                        <Pill
                          label={cluster}
                          image={
                            cluster.includes("solana")
                              ? "/solana.svg"
                              : cluster.includes("eclipse")
                              ? "/eclipse.svg"
                              : "/default_image_light.svg"
                          }
                        />
                      </TooltipTrigger>
                      <TooltipContent className="bg-lightbackground dark:bg-darkbackground border border-border/30 dark:border-darkborder/10">
                        <p className="font-neue text-xs text-stone-700 dark:text-stone-50">
                          Current SVM cluster
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <ConnectButton />
              <LightDarkButton />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
