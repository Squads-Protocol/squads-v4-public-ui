import {
  CommandIcon,
  HomeIcon,
  UsersIcon,
  Package2Icon,
  SettingsIcon,
  PackageIcon,
  ArrowLeftRightIcon,
  InfoIcon,
  Settings2Icon,
  PiggyBankIcon,
  WalletCardsIcon,
} from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import MultisigInput from "@/components/MultisigInput";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import * as multisig from "@sqds/multisig";
import { Toaster } from "@/components/ui/sonner";
import ConnectWallet from "@/components/ConnectWalletButton";
import { LucideHome, ArrowDownUp, Users, Settings } from "lucide-react";

const AppLayout = async ({ children }: { children: React.ReactNode }) => {
  const tabs = [
    {
      name: "Home",
      icon: <LucideHome />,
      route: "/",
    },
    {
      name: "Transactions",
      icon: <ArrowDownUp />,
      route: "/transactions",
    },
    {
      name: "Configuration",
      icon: <Users />,
      route: "/config",
    },
    {
      name: "Settings",
      icon: <Settings />,
      route: "/settings",
    },
  ];

  const headersList = headers();

  const path = headersList.get("x-pathname");
  const multisigCookie = headersList.get("x-multisig");
  const multisig = await isValidPublicKey(multisigCookie!);

  return (
    <body>
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
                    src="https://drive.google.com/uc?export=download&id=1UjZG82vU6aQHiGxzZEzoTneP7TTSsKda"
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: "150px", height: "auto" }}
                    alt="Mercure Logo"
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

        <div className="md:w-9/12 md:ml-auto space-y-2 p-3 pt-4 mt-1 md:space-y-4 md:p-8 md:pt-6 pb-24">
          {multisig ? <div>{children} </div> : <MultisigInput />}
        </div>
      </div>
      <Toaster />
    </body>
  );
};

export default AppLayout;

const isValidPublicKey = async (multisigString: string) => {
  try {
    const multisigPubkey = new PublicKey(multisigString); // This will throw an error if the string is not a valid public key
    const rpcUrl = headers().get("x-rpc-url");
    const connection = new Connection(rpcUrl || clusterApiUrl("mainnet-beta"));
    await multisig.accounts.Multisig.fromAccountAddress(
      connection,
      multisigPubkey
    );
    return true;
  } catch (e) {
    return false;
  }
};
