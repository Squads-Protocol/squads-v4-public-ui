import * as multisig from "@sqds/multisig";
import {
  AccountInfo,
  ParsedAccountData,
  PublicKey,
  RpcResponseAndContext,
} from "@solana/web3.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import SendTokens from "./SendTokensButton";

type TokenListProps = {
  tokens: RpcResponseAndContext<
    {
      pubkey: PublicKey;
      account: AccountInfo<ParsedAccountData>;
    }[]
  >;
  rpcUrl: string;
  multisigPda: string;
  vaultIndex: number;
  programId?: string;
};

export function TokenList({
  tokens,
  rpcUrl,
  multisigPda,
  vaultIndex,
  programId,
}: TokenListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tokens</CardTitle>
        <CardDescription>The tokens you hold in your wallet</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {tokens.value.map((token) => (
            <div key={token.account.data.parsed.info.mint}>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Mint: {token.account.data.parsed.info.mint}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Amount:{" "}
                    {token.account.data.parsed.info.tokenAmount.uiAmount}
                  </p>
                </div>
                <div className="ml-auto">
                  <SendTokens
                    mint={token.account.data.parsed.info.mint}
                    tokenAccount={token.pubkey.toBase58()}
                    decimals={
                      token.account.data.parsed.info.tokenAmount.decimals
                    }
                    rpcUrl={rpcUrl}
                    multisigPda={multisigPda}
                    vaultIndex={vaultIndex}
                    programId={programId}
                  />
                </div>
              </div>
              <hr className="mt-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
