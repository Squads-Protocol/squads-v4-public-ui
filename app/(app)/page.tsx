import * as multisig from "@sqds/multisig";
import {
  Connection,
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
  clusterApiUrl,
} from "@solana/web3.js";
import { cookies, headers } from "next/headers";
import { TokenList } from "@/components/tokens/token-list";
import { VaultDisplayer } from "@/components/vault-display";
import PageHeader from "@/components/layout/page-header";
import MyMultisigs from "@/components/ui/squads/my-multisigs";
import { lookupAddress } from "@/lib/helpers/tokenAddresses";
import { FilteredToken } from "@/lib/types";
import ChangeUpgradeAuth from "@/components/config/change-upgrade-auth";
import * as bs58 from "bs58";

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

  const multisigInfo = await multisig.accounts.Multisig.fromAccountAddress(
    connection,
    multisigPda
  );

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

  const a = () => {
    let b = bs58.default.decode(
      "f8FMmaomsDZZN2ViKpwx25uztE657ZkfFyXravqtHd6Lsp6fGyeaPDQQaRiD4tDzT4Hg1wW5czWuMzYj6MXKpBo8tP2cXVVsoUKvjDWtDPzRbCGkEoZyPFUzsV34vhySAXL7UUY6GqcXWAJXjs6jC8Cb9qtakRYPi8zvMQ2FS1mceJexNA1MUpthKrqUuYcKS2QXiprjZtHPiw3TCqET9gjziMtsGdZtEiwddA7jfCR8SZGJX14SSRLmjLybXq4pDzZuMXs8QxpJY7CaPebTuSzCo7HC8r8Ae7rgbTJ5j6pR7kj7DifFhbBGgwKi2iRbSRPbuTwYbevVX5eNNdhYPb9kBhXZCkfuaiZuPa9MYJ6WZF82tU7t9Agoe6UmgzZQkJTHoDAkGpnKLU1tj5GwzRfXt5MEcQhJEW6fv1PP3RzRbvqUiVV6tmXnsZuRyT3ijw36YFquPmrmNsy3kkk2hn4iTaisMtsxnFrqx9eFutAXGLw6ggdT6WBqg3FhjaTE7Sd7L8eAHdPZnjVrSwd1LLdK3dZ1f1Bu4tM1uwEqCPneBEYPKytHunpZFJe6MiyZMxWaqeb9md73tRSyXihknaVJxb1EhPppMRqJ9HmSAUidC5hNcSP6shCEsLo7trFf9Pf75wTNJUuDgmUNc7BEuPuQzrMzvnhvvm7LCpTeaGoockFYL84qCuipTg4zjeUYG4WmvHhvNYXRAYbjPuRKA5vnUA8cdFXirbETNFsh4XtJVAgdqb7R8JFafmHHHk2ryMYhMC6WoY19XWiPTmEVoK24d7Aa1y2sjEsVU7f78HYyDrmmRUQNAFn82PPBnBbCPzZC9MiRzwQnLgn9HwSMqhnbPgVxJDvrVy82ktPcPFuDcVWSqSE929QrtxyykGMpCZhkxEEzST2BAUuXvCyE7qLMfXfSWiWZGkEcywYT3JgxUNBunj9FP4saU9qkxnHqtN2xC1KwpaqXXVLcEe7Uj75J84sj4C8MuuMBKTrhLu1yR5YFVqLFaM8S1GeGsd5oNZ1G63Nj2F2NuKFheWXsq8dReN23EjgKmDVRa6PBtu6Sv4PsbQwyFDxMNkLg5hBqvx31Bzw72UYyanVQCNW6hZJcGKXKUwn4rYam7hThQLZU6atqMEureBk52jGXnmqjRZ8p5xT7uhCEa2K8tNNfXFmH6g6hoR59mZUDvqTaiS9EnCsFXtKp4bxLWRBnasLdvDQsTkkD6TDsCrH5koLSMs52tvgu64KmuUZqy7BeBS99g4c3YLBP2ipK7eMfEswN5jLTuNq7LTjHvgBiEqyQbsJdYLWCLm7rvfwDhQT4BNGsP98AUZ7XEqzuqW7QCYhMbsh7oY7Teeqt6B3ppjX1XYifcKqZfa463FrLcjTdjjUq1LBRXhvoxtsHAtud"
    );
    let message = TransactionMessage.decompile(
      VersionedTransaction.deserialize(b).message,
      {
        addressLookupTableAccounts: [],
      }
    );
    message.instructions.splice(1, 2);
    return {
      base58: bs58.default.encode(message.compileToLegacyMessage().serialize()),
      base64: Buffer.from(
        message.compileToLegacyMessage().serialize()
      ).toString("base64"),
    };
  };

  console.log(a());

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
        <div className="w-1/2 flex-col space-y-4">
          <TokenList
            solBalance={solBalance}
            tokens={tokens}
            rpcUrl={rpcUrl!}
            multisigPda={multisigCookie!}
            vaultIndex={vaultIndex || 0}
          />
          <ChangeUpgradeAuth
            multisigPda={multisigCookie!}
            rpcUrl={rpcUrl || clusterApiUrl("mainnet-beta")}
            transactionIndex={
              multisigInfo.transactionIndex
                ? Number(multisigInfo.transactionIndex) + 1
                : 1
            }
            vaultIndex={vaultIndex}
            programId={
              programIdCookie ? programIdCookie : multisig.PROGRAM_ID.toBase58()
            }
          />
        </div>
      </div>
    </main>
  );
}
