"use client";
import Image from "next/image";
import Link from "next/link";
import ConnectButton from "./wallet/connect-button";
import Pill from "../ui/pill";
import { usePathname } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { useTheme } from "next-themes";
import LightDarkButton from "./light-dark-button";

export default function Header({ multisig }: { multisig: string | null }) {
  const pathname = usePathname();
  const { connected } = useWallet();
  const { theme } = useTheme();

  const logo = theme == "dark" ? "/squads-light.png" : "/logo.svg";

  console.log(multisig);

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
                  <Pill
                    label={multisig.slice(0, 4) + "..." + multisig.slice(-4)}
                    image="/default_image_light.svg"
                  />
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
