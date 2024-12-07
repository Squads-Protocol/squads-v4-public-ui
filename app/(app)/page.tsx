import * as multisig from "@sqds/multisig";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { cookies, headers } from "next/headers";
import { TokenList } from "@/components/tokens/token-list";
import { VaultDisplayer } from "@/components/vault-display";
import MyMultisigs from "@/components/ui/squads/my-multisigs";
import { FilteredToken } from "@/lib/types";
import SectionHeader from "@/components/layout/section-header";
import { Metaplex } from "@metaplex-foundation/js";
import { getTokenMetadata } from "@/lib/helpers/getTokenMetadata";
import { lookupAddress } from "@/lib/helpers/tokenAddresses";
import { getClusterName } from "@arrangedev/detect-cluster";

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

  const metaplex = Metaplex.make(connection as any);

  const cluster = await getClusterName(rpcUrl!);

  const [multisigVault] = multisig.getVaultPda({
    multisigPda,
    index: vaultIndex || 0,
    programId: programId ? programId : multisig.PROGRAM_ID,
  });

  const multisigInfo = await multisig.accounts.Multisig.fromAccountAddress(
    connection,
    multisigPda
  );

  const solBalance = await connection.getBalance(multisigVault);
  console.log(solBalance)

  const tokensInWallet = await connection.getParsedTokenAccountsByOwner(
    multisigVault,
    {
      programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    }
  );

  const tokens: FilteredToken[] = await Promise.all(
    tokensInWallet.value.map(async (t) => {
      const mint = t.account.data.parsed.info.mint;

      if (!mint)
        return {
          ...t,
          mint: mint,
          symbol: null,
          icon: null,
        };

      const metadata = await getTokenMetadata(metaplex, new PublicKey(mint));

      if (metadata) {
        return {
          ...t,
          mint: mint,
          symbol: metadata.symbol ?? mint.slice(0, 4) + "..." + mint.slice(-4),
          icon: metadata.image ?? null,
        };
      } else {
        const matched = lookupAddress(mint);
        if (matched) {
          return {
            ...t,
            mint: mint,
            symbol: matched.key,
            icon: matched.icon,
          };
        }
        return {
          ...t,
          mint: mint,
          symbol: null,
          icon: null,
        };
      }
    })
  );

  return (
    <>
      <SectionHeader
        title="Home"
        description="View general information related to your Squad."
      />
      <section className="px-8 my-14">
        <div className="w-full flex gap-4 items-start">
          <div className="w-1/2 flex-col space-y-4">
            <VaultDisplayer
              multisigPdaString={multisigCookie!}
              vaultIndex={vaultIndex || 0}
            />
            <MyMultisigs rpc={rpcUrl!} />
          </div>
          <div className="w-1/2 flex-col space-y-4">
            <TokenList
              solBalance={solBalance}
              tokens={tokens}
              rpcUrl={rpcUrl!}
              multisigPda={multisigCookie!}
              vaultIndex={vaultIndex || 0}
              cluster={cluster!}
            />
          </div>
        </div>
      </section>
    </>
  );
}
