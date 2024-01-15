import { AccountInfo, ParsedAccountData, PublicKey, RpcResponseAndContext } from "@solana/web3.js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

type TokenListProps = {
  tokens: RpcResponseAndContext<{
    pubkey: PublicKey;
    account: AccountInfo<ParsedAccountData>;
  }[]>;
};

export function TokenList({ tokens }: TokenListProps) {
    return (
        <Card>
             <CardHeader>
                    <CardTitle>Tokens</CardTitle>
                    <CardDescription>
                      The tokens you hold in your wallet
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
      <div className="space-y-8">
        {tokens.value.map((token) => (
            <div key={token.account.data.parsed.info.mint}>
        <div className="flex items-center">
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">Mint: {token.account.data.parsed.info.mint}</p>
            <p className="text-sm text-muted-foreground">Amount:
            {token.account.data.parsed.info.tokenAmount.uiAmount *
                10 ** token.account.data.parsed.info.tokenAmount.decimals}
            </p>
          </div>
          <div className="ml-auto font-medium">Amount: {token.account.data.parsed.info.tokenAmount.uiAmount}</div>
        </div>
        <hr className="mt-2"/>
        </div>
          ))}
      </div>
      </CardContent>
      </Card>
    )
}