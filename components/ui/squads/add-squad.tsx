import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";
import { ListChecks, ScanEye, Wallet, X } from "lucide-react";
import MultisigInput from "@/components/settings/set-multisig";
import { useCluster } from "@/state/ClusterContext";

interface AddSquadModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddSquadModal({ open, setOpen }: AddSquadModalProps) {
  const { rpc } = useCluster();

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
                      <h3 className="px-3 text-2xl font-neuemedium bg-gradient-to-br from-white to-stone-600 bg-clip-text leading-none text-transparent pointer-events-none">
                        Add Squad
                      </h3>
                      <p className="mt-2 px-3 text-base text-stone-400/75 font-neue pointer-events-none">
                        Set your current Squad for this session.
                      </p>
                      <div className="mt-6">
                        <MultisigInput rpc={rpc} current={""} />
                      </div>
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
