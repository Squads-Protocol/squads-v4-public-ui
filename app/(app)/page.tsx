import * as multisig from "@sqds/multisig";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { cookies, headers } from "next/headers";
import Image from "next/image";
import { TokenList } from "@/components/TokenList";
import { VaultDisplayer } from "@/components/VaultDisplayer";
import PageHeader from "@/components/ui/layout/page-header";
import MyMultisigs from "@/components/ui/my-multisigs";
import { lookupAddress } from "@/lib/helpers/tokenAddresses";
import { FilteredToken } from "@/lib/types";

export default async function Home() {
  const rpcUrl = headers().get("x-rpc-url");

  const connection = new Connection(rpcUrl || clusterApiUrl("mainnet-beta"));
  const multisigCookie = headers().get("x-multisig");
  const multisigPda = new PublicKey(multisigCookie!);
  const vaultIndex = Number(headers().get("x-vault-index"));
  const programIdCookie = cookies().get("x-program-id")?.value;
  const programId = programIdCookie
    ? new PublicKey(programIdCookie!)
    : multisig.PROGRAM_ID;

  const multisigVault = multisig.getVaultPda({
    multisigPda,
    index: vaultIndex || 0,
    programId: programId ? programId : multisig.PROGRAM_ID,
  })[0];

  const solBalance = await connection.getBalance(multisigVault);

  const tokensInWallet = await connection.getParsedTokenAccountsByOwner(
    multisigVault,
    {
      programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    }
  );

  const tokens: FilteredToken[] = tokensInWallet.value.map((t) => {
    const mint = t.account.data.parsed.info.mint;
    const matched = lookupAddress(mint);

    if (matched) {
      return {
        ...t,
        mint: mint,
        symbol: matched.key,
        icon: matched.icon,
      };
    } else {
      return {
        ...t,
        mint: mint,
        symbol: null,
        icon: null,
      };
    }
  });

  return (
    <main className="">
      <PageHeader heading="Home" />
      <div className="w-full flex gap-4 items-start mb-24">
        <div className="w-1/2 flex-col space-y-4">
          <VaultDisplayer
            multisigPdaString={multisigCookie!}
            vaultIndex={vaultIndex || 0}
          />
          <MyMultisigs rpc={rpcUrl!} />
        </div>
        <div className="w-1/2 flex-col gap-4">
          <TokenList
            solBalance={solBalance}
            tokens={tokens}
            rpcUrl={rpcUrl!}
            multisigPda={multisigCookie!}
            vaultIndex={vaultIndex || 0}
          />
        </div>
      </div>
    </main>
  );
}
