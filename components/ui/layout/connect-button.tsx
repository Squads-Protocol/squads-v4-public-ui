"use client";
import { Wallet, useWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";
import WalletModal from "../wallet-modal";
import { Fragment, useState } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { cn } from "@/lib/utils";
import { Eye, LogOut } from "lucide-react";
import Link from "next/link";
import { PublicKey } from "@solana/web3.js";

export default function ConnectButton() {
  const { connected, publicKey, wallet, disconnect } = useWallet();
  const [open, setOpen] = useState(false);

  return (
    <>
      <WalletModal open={open} setOpen={setOpen} />
      {connected ? (
        <ConnectedState
          publicKey={publicKey!}
          wallet={wallet!}
          disconnect={disconnect}
        />
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="px-6 py-2 inline-flex gap-2 font-neue items-center rounded-lg bg-gradient-to-br from-stone-700 to-stone-800 text-white dark:bg-gradient-to-br dark:from-white/[0.03] dark:to-white/[0.03] hover:bg-gradient-to-br hover:from-stone-600 hover:to-stone-700 transition duration-200"
        >
          Connect Wallet
        </button>
      )}
    </>
  );
}

function ConnectedState({
  publicKey,
  wallet,
  disconnect,
}: {
  publicKey: PublicKey;
  wallet: Wallet;
  disconnect: () => void;
}) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton>
          <button className="px-6 py-2 inline-flex gap-2 font-neue items-center rounded-lg bg-gradient-to-br from-stone-700 to-stone-800 text-white dark:bg-gradient-to-br dark:from-white/[0.03] dark:to-white/[0.03] hover:bg-gradient-to-br hover:from-stone-600 hover:to-stone-700 transition duration-200">
            <Image
              src={wallet?.adapter.icon as string}
              alt=""
              width={10}
              height={10}
              className="w-4 h-4 rounded-lg"
            />
            {publicKey?.toString().slice(0, 4) +
              "..." +
              publicKey?.toString().slice(-4)}
          </button>
        </MenuButton>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute right-0 z-10 mt-[0.65rem] w-40 origin-top-right rounded-md font-neue bg-white dark:bg-darkforeground border border-stone-300/75 dark:border-darkborder/30 shadow-lg focus:outline-none">
          <div className="">
            <MenuItem>
              {({ active }) => (
                <Link
                  href={`https://explorer.solana.com/address/${publicKey?.toString()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    active
                      ? "w-full inline-flex gap-2 items-center font-neue bg-zinc-500/25 text-zinc-900 dark:text-white"
                      : "text-zinc-700 dark:text-white",
                    "w-full inline-flex gap-2 items-center font-neue px-4 py-2 text-left text-sm rounded-t-md"
                  )}
                >
                  <Eye size={18} strokeWidth={1} />
                  View Squad
                </Link>
              )}
            </MenuItem>
            <MenuItem>
              {({ active }) => (
                <button
                  onClick={() => disconnect()}
                  className={cn(
                    active
                      ? "w-full inline-flex gap-2 items-center font-neue bg-zinc-500/25 text-zinc-900 dark:text-white"
                      : "text-zinc-700 dark:text-white",
                    "w-full inline-flex gap-2 items-center font-neue px-4 py-2 text-left text-sm rounded-b-md"
                  )}
                >
                  <LogOut size={18} strokeWidth={1} />
                  Disconnect
                </button>
              )}
            </MenuItem>
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
}
