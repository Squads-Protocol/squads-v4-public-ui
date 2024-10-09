import * as multisig from "@sqds/multisig";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { PublicKey } from "@solana/web3.js";
import { VaultSelector } from "./VaultSelector";

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
    <Card className="w-fit my-3">
      <CardHeader>
        <CardTitle>Squads Vault</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-1">Address: {vaultAddress[0].toBase58()}</p>
        <br />
        <VaultSelector />
      </CardContent>
    </Card>
  );
}
