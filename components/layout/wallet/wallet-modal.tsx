import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";
import { ListChecks, ScanEye, Wallet, X } from "lucide-react";

interface WalletModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function WalletModal({ open, setOpen }: WalletModalProps) {
  const { wallets, select, connected, disconnect } = useWallet();

  useEffect(() => {
    const check = () => {
      if (connected) {
        setOpen(false);
      }
    };
    check();
  }, [connected]);

  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[100]"
          onClose={() => setOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-[#121212]/60 backdrop-blur-lg transition-opacity" />
          </Transition.Child>
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel
                  className={`relative transform overflow-hidden rounded-md text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg max-[640px]:my-auto`}
                >
                  <div className="back relative bg-darkforeground border border-[#A9A9A9]/30 shadow-xl w-full rounded-md h-full max-[640px]:p-4">
                    <X
                      width={20}
                      height={20}
                      className="absolute top-4 right-4 text-[#A9A9A9] hover:text-white/75"
                      onClick={() => setOpen(false)}
                    />
                    <div className="flex min-h-full flex-1 flex-col px-4 py-8">
                      {wallets.filter(
                        (wallet) => wallet.readyState === "Installed"
                      ).length > 0 ? (
                        <>
                          <h3 className="px-3 text-2xl font-neuemedium bg-gradient-to-br from-white to-stone-600 bg-clip-text leading-none text-transparent pointer-events-none">
                            Connect Wallet
                          </h3>
                          <p className="mt-2 px-3 text-base text-stone-400/75 font-neue pointer-events-none">
                            Please select your wallet to continue.
                          </p>
                          <div className="mt-4 grid grid-cols-4 px-1 pb-4">
                            {wallets
                              .filter(
                                (wallet) => wallet.readyState === "Installed"
                              )
                              .slice(0, 3)
                              .map((wallet, i) => (
                                <div key={i} className="w-full px-2">
                                  <button
                                    onClick={() => {
                                      if (connected) disconnect();
                                      select(wallet.adapter.name);
                                    }}
                                    className="w-full flex-col gap-2 justify-center items-center px-2 py-3 rounded-md border border-[#A9A9A9]/30 hover:border-[#A9A9A9] transition ease-in-out delay-110 hover:-translate-y-1 hover:scale-101"
                                  >
                                    <Image
                                      src={wallet.adapter.icon}
                                      alt=""
                                      width={50}
                                      height={50}
                                      className="w-10 h-10 rounded-lg mx-auto"
                                    />
                                    <p className="mt-2 text-center text-sm font-neue text-white/75">
                                      {wallet.adapter.name}
                                    </p>
                                  </button>
                                </div>
                              ))}
                            <div className="w-full px-2">
                              <button
                                onClick={() => {}}
                                className="w-full flex-col gap-2 justify-center items-center px-2 py-3 rounded-md border border-[#A9A9A9]/30 hover:border-[#A9A9A9] transition ease-in-out delay-110 hover:-translate-y-1 hover:scale-101"
                              >
                                <Wallet
                                  strokeWidth={1}
                                  className="w-10 h-10 mx-auto text-white/75"
                                />
                                <p className="mt-2 text-center text-sm text-white/75">
                                  More
                                </p>
                              </button>
                            </div>
                          </div>
                          <div className="mt-3 mb-4 mx-3 border-t border-[#A9A9A9]/30"></div>
                          <div className="px-3 flex-col space-y-3 items-start">
                            <div className="flex gap-2 items-center pointer-events-none">
                              <ScanEye
                                strokeWidth={1}
                                className="text-stone-400/75"
                              />
                              <p className="text-stone-400/75 font-neuelight">
                                Wallet will be in read-only mode by default
                              </p>
                            </div>
                            <div className="flex gap-2 items-center pointer-events-none">
                              <ListChecks
                                strokeWidth={1}
                                className="text-stone-400/75"
                              />
                              <p className="text-stone-400/75 font-neuelight">
                                Nothing will be executed without your signature
                              </p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex-col mx-auto py-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            className="mx-auto w-8 h-8"
                          >
                            {" "}
                            <path d="M22 4v16h-6V4h6Zm-2 2h-2v12h2V6Zm-5 4v10H9V10h6Zm-2 8v-6h-2v6h2Zm-5-4v6H2v-6h6Zm-2 4v-2H4v2h2Z" />{" "}
                          </svg>
                          <label className="mt-3 text-lg">
                            No wallets found :(
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
