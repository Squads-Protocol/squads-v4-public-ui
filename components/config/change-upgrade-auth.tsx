import * as multisig from "@sqds/multisig";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/primitives/card";
import { clusterApiUrl } from "@solana/web3.js";
import ChangeUpgradeAuthorityInput from "./change-upgrade-auth-input";

interface ChangeUpgradeAuthProps {
  multisigPda: string;
  transactionIndex: number;
  rpcUrl: string;
  vaultIndex: number;
  programId: string;
}

export default function ChangeUpgradeAuth({
  multisigPda,
  transactionIndex,
  rpcUrl,
  vaultIndex,
  programId,
}: ChangeUpgradeAuthProps) {
  return (
    <Card className="dark:bg-darkforeground dark:border-darkborder/30 font-neue">
      <CardHeader className="space-y-3">
        <CardTitle className="inline-flex gap-2 items-center tracking-wide">
          Change Program Upgrade Authority
        </CardTitle>
        <CardDescription className="text-stone-500 dark:text-white/50">
          Change the upgrade authority of one of your programs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChangeUpgradeAuthorityInput
          multisigPda={multisigPda}
          rpcUrl={rpcUrl || clusterApiUrl("mainnet-beta")}
          transactionIndex={transactionIndex ?? 1}
          vaultIndex={vaultIndex}
          globalProgramId={
            programId ? programId : multisig.PROGRAM_ID.toBase58()
          }
        />
      </CardContent>
    </Card>
  );
}
