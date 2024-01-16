import * as multisig from "@sqds/multisig";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { PublicKey } from "@solana/web3.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { VaultSelector } from "./VaultSelector";

type VaultDisplayerProps = {
  multisigPdaString: string;
  vaultIndex: number;
};

export function VaultDisplayer({
  multisigPdaString,
  vaultIndex,
}: VaultDisplayerProps) {
  const vaultAddress = multisig.getVaultPda({
    multisigPda: new PublicKey(multisigPdaString),
    index: vaultIndex,
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
