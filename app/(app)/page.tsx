'use client';

import { TokenList } from '@/components/TokenList';
import { VaultDisplayer } from '@/components/VaultDisplayer';
import { useMultisigData } from '@/hooks/useMultisigData';
import { ChangeMultisig } from '@/components/ChangeMultisig';

export default function Home() {
  const { multisigAddress } = useMultisigData();

  return (
    <main>
      <div>
        <h1 className="text-3xl font-bold mb-4">Overview</h1>
        {multisigAddress && <VaultDisplayer />}
        {multisigAddress && <ChangeMultisig />}
        {multisigAddress && <TokenList multisigPda={multisigAddress} />}
      </div>
    </main>
  );
}
