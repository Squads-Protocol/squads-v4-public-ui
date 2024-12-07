import * as multisig from "@sqds/multisig";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/primitives/card";
import { PublicKey } from "@solana/web3.js";
import { VaultSelector } from "./vault-selector";
import CopyTextButton from "./ui/misc/copy-text";
import Alert from "./ui/alert";

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
    <Card className="w-full font-neue dark:bg-darkforeground dark:border-darkborder/10">
      <CardHeader>
        <CardTitle className="tracking-wide">Current Vault</CardTitle>
      </CardHeader>
      <CardContent className="text-muted-foreground dark:text-white/50">
        <Alert title="Use your vault address" description="Please ensure you're sending funds to a valid vault address. Sending funds to the multisig account will result in them being potentially unrecoverable." />
        <div className="flex items-center gap-4 my-6">
          <div className="flex items-center gap-2">
            <p className="text-lg text-stone-200">
              {vaultAddress[0].toBase58().slice(0, 8) +
                "..." +
                vaultAddress[0].toBase58().slice(-8)}
            </p>
            <CopyTextButton text={vaultAddress[0].toBase58()} />
          </div>
        </div>
        <VaultSelector />
      </CardContent>
    </Card>
  );
}
