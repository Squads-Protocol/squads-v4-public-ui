import { AlertOctagon } from "lucide-react";
import CreateTransaction from "../../create/create-transaction";

export default function TransactionTableFallback({ rpc, multisigAddr, vaultIndex, programId }: { rpc: string, multisigAddr: string, vaultIndex: number, programId?: string }) {
  return (
    <div className="w-full h-[25rem] flex items-center justify-center bg-darkforeground rounded-md p-4">
      <div className="w-full flex-col justify-center">
        <div className="mx-auto p-3 w-fit bg-stone-500/25 rounded-md">
          <AlertOctagon className="text-stone-400 w-6 h-6" />
        </div>
        <h4 className="mt-4 font-neue font-semibold text-lg text-center text-stone-700 dark:text-white/75">
          No Transactions Yet.
        </h4>
        <p className="mt-2 font-neue text-base text-center text-stone-400 dark:text-white/25">
          Click below to create your first.
        </p>
        <div className="mt-4 flex justify-center">
          <CreateTransaction rpcUrl={rpc} multisigPda={multisigAddr} vaultIndex={vaultIndex} programId={programId} />
        </div>
      </div>
    </div>
  );
}
