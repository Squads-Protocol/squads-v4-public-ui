import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { headers } from "next/headers";
import Image from "next/image";
import * as multisig from "@sqds/multisig";
import { TokenList } from "@/components/TokenList";
import { VaultDisplayer } from "@/components/VaultDisplayer";

export default async function Home() {
  const rpcUrl = headers().get("x-rpc-url");

  const connection = new Connection(rpcUrl || clusterApiUrl("mainnet-beta"));
  const multisigCookie = headers().get("x-multisig");
  const multisigPda = new PublicKey(multisigCookie!);
  const vaultIndex = Number(headers().get("x-vault-index"));
  const programIdCookie = headers().get("x-program-id");
  const programId = new PublicKey(programIdCookie!);
  const multisigVault = multisig.getVaultPda({
    multisigPda,
    index: vaultIndex || 0,
    programId: programId ? programId : multisig.PROGRAM_ID,
  })[0];

  const tokensInWallet = await connection.getParsedTokenAccountsByOwner(
    multisigVault,
    {
      programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    }
  );

  return (
    <main className="">
      <div>
        <h1 className="text-3xl font-bold mb-4">Overview</h1>

        <VaultDisplayer
          multisigPdaString={multisigCookie!}
          vaultIndex={vaultIndex || 0}
          programId={programIdCookie!}
        />
        <TokenList
          tokens={tokensInWallet}
          rpcUrl={rpcUrl!}
          multisigPda={multisigCookie!}
          vaultIndex={vaultIndex || 0}
          programId={programIdCookie!}
        />
      </div>
    </main>
  );
}
