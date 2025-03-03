import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { VaultSelector } from './VaultSelector';
import { useMultisigData } from '@/hooks/useMultisigData';

type VaultDisplayerProps = {};

export function VaultDisplayer({}: VaultDisplayerProps) {
  const { multisigVault: vaultAddress } = useMultisigData();

  return (
    <Card className="w-fit my-3">
      <CardHeader>
        <CardTitle>Squads Vault</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-1">Address: {vaultAddress?.toBase58()}</p>
        <br />
        <VaultSelector />
      </CardContent>
    </Card>
  );
}
