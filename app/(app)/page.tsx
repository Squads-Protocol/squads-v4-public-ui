"use client";

import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import * as multisig from "@sqds/multisig";
import { TokenList } from "@/components/TokenList";
import { VaultDisplayer } from "@/components/VaultDisplayer";
import { useCookie } from "@/app/(app)/cookies";
import { useBalance, useGetTokens, useMultisigData } from '@/app/(app)/services';
import { useMemo } from "react";

export default function Home() {
  const {
    rpcUrl,
    connection,
    multisigAddress,
    vaultIndex,
    programId,
    multisigVault,
  } = useMultisigData();

  const { data: solBalance = 0 } = useBalance(
    connection,
    multisigVault?.toBase58() || ""
  );

  const { data: tokensInWallet = null } = useGetTokens(
    connection,
    multisigVault?.toBase58() || ""
  );

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
