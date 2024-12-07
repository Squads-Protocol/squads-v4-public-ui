import { Fragment, SetStateAction } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import { useWallet } from "@solana/wallet-adapter-react";
import { Eye, Plug } from "lucide-react";
import Pill from "@/components/ui/pill";
import { useCluster } from "@/state/ClusterContext";

interface WalletMenuProps {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
}

export default function WalletMenu({ open, setOpen }: WalletMenuProps) {
  const { wallet, publicKey } = useWallet();
  const { cluster } = useCluster();

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="fixed z-[100]" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md z-100 py-4 pr-4">
                  <div className="flex flex-reverse h-full flex-col overflow-y-scroll bg-darkforeground rounded-md pt-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4 items-center">
                          <Image
                            src={wallet?.adapter.icon || ""}
                            alt=""
                            width={100}
                            height={100}
                            className="w-14 h-14 rounded-full"
                          />
                          <div className="flex-col space-y-1 items-start">
                            <p className="font-plex font-medium text-base text-white">
                              {publicKey?.toString().slice(0, 4) + "..." + publicKey?.toString().slice(-4)}
                            </p>
                            <Pill
                              label={cluster!}
                              image={
                                cluster?.includes("solana")
                                  ? "/assets/solana.svg"
                                  : cluster?.includes("eclipse")
                                    ? "/assets/eclipse.svg"
                                    : "/assets/default_image_light.svg"
                              }
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 items-center">
                          <button className="py-2 px-2 border border-zinc-500 bg-darkforeground rounded-full hover:bg-zinc-600">
                            <Eye
                              strokeWidth={1}
                              size={16}
                              className="text-zinc-400"
                            />
                          </button>
                          <button
                            onClick={() => {
                              setOpen(false);
                            }}
                            className="py-2 px-2 border border-zinc-500 bg-darkforeground rounded-full hover:bg-zinc-600"
                          >
                            <Plug
                              strokeWidth={1}
                              size={16}
                              className="text-zinc-400"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                    {/*
                    <div>
                      <div className="my-6 px-6">
                        <div className="flex gap-2 items-center font-plex text-zinc-300">
                          <IconChartGridDots />
                          <p>Level 1</p>
                        </div>
                        <progress
                          value={currentUser?.xp}
                          max={150}
                          className="progress-bar h-[8px] rounded-full bg-neutral-700"
                        />
                      </div>
                    </div>
                        */}
                    <hr className="mt-6 border-zinc-500/50"></hr>
                    <div className="relative flex-1 px-4 pt-6 bg-darkbackground sm:px-6">

                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
