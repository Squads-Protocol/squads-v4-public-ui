import Image from "next/image";
import SendSol from "./send-sol";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { nWithCommas } from "@/lib/nFormatter";

export default function SolanaRow({
  rpcUrl,
  multisig,
  solanaBalance,
  vaultIndex,
  programId,
  cluster,
}: {
  rpcUrl: string;
  multisig: string;
  solanaBalance: number;
  vaultIndex: number;
  programId?: string;
  cluster?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Image
          src={
            cluster?.includes("eclipse")
              ? "/tokens/eth.svg"
              : "/tokens/SOL.webp"
          }
          width={30}
          height={30}
          alt={cluster?.includes("eclipse") ? "wETH Icon" : "SOL Icon"}
          className="w-8 h-8 rounded-full"
        />
        <div className="flex flex-col space-y-0.5 items-start justify-start">
          <p className="text-sm font-neuemedium leading-none text-stone-700 dark:text-white">
            {cluster?.includes("eclipse") ? "wETH" : "SOL"}
          </p>
          <div className="flex items-baseline gap-1">
            <p className="text-xs text-stone-500 dark:text-white/50 font-neue">
              Balance:{" "}
              {(solanaBalance / LAMPORTS_PER_SOL).toFixed(6)}
            </p>
          </div>
        </div>
      </div>
      <div className="ml-auto">
        <SendSol
          rpcUrl={rpcUrl}
          multisigPda={multisig}
          vaultIndex={vaultIndex}
          programId={programId}
        />
      </div>
    </div>
  );
}
