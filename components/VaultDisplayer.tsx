import * as multisig from "@sqds/multisig";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/primitives/card";
import { PublicKey } from "@solana/web3.js";
import { VaultSelector } from "./VaultSelector";
import CopyTextButton from "./ui/misc/copy-text";

type VaultDisplayerProps = {
  multisigPdaString: string;
  vaultIndex: number;
  programId?: string;
};

export function VaultDisplayer({
  multisigPdaString,
  vaultIndex,
  programId,
}: VaultDisplayerProps) {
  const vaultAddress = multisig.getVaultPda({
    multisigPda: new PublicKey(multisigPdaString),
    index: vaultIndex,
    programId: programId ? new PublicKey(programId) : multisig.PROGRAM_ID,
  });

  return (
    <Card className="w-full font-neue dark:bg-darkforeground dark:border-darkborder/30">
      <CardHeader>
        <CardTitle className="tracking-wide">Current Vault</CardTitle>
      </CardHeader>
      <CardContent className="text-muted-foreground dark:text-white/50">
        <div className="flex items-center gap-4 mb-6">
          <span className="text-stone-700 dark:text-white/75">
            Account {vaultIndex}:{" "}
          </span>
          <div className="flex items-center gap-2">
            <p className="text-stone-500">
              {vaultAddress[0].toBase58().slice(0, 4) +
                "..." +
                vaultAddress[0].toBase58().slice(-4)}
            </p>
            <CopyTextButton text={vaultAddress[0].toBase58()} />
          </div>
        </div>
        <VaultSelector />
      </CardContent>
    </Card>
  );
}
