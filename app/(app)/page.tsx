'use client';

import { TokenList } from '@/components/TokenList';
import { VaultDisplayer } from '@/components/VaultDisplayer';
import { useBalance, useGetTokens } from '@/hooks/useServices';

import { useMultisigData } from '@/hooks/useMultisigData';
import { ChangeMultisig } from '@/components/ChangeMultisig';

export default function Home() {
  const { rpcUrl, connection, multisigAddress, vaultIndex, programId, multisigVault } =
    useMultisigData();

  const { data: solBalance = 0 } = useBalance(connection, multisigVault?.toBase58() || '');

  const { data: tokensInWallet = null } = useGetTokens(connection, multisigVault?.toBase58() || '');

  return (
    <main>
      <div>
        <h1 className="text-3xl font-bold mb-4">Overview</h1>
        {multisigAddress && (
          <VaultDisplayer
            multisigPdaString={multisigAddress}
            vaultIndex={vaultIndex}
            programId={programId.toBase58()}
          />
        )}
        {multisigAddress && <ChangeMultisig />}
        {multisigAddress && (
          <TokenList
            solBalance={solBalance || 0}
            tokens={tokensInWallet}
            rpcUrl={rpcUrl}
            multisigPda={multisigAddress}
            vaultIndex={vaultIndex}
            programId={programId.toBase58()}
          />
        )}
      </div>
    </main>
  );
}
