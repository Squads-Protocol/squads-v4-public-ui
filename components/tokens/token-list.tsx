import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/primitives/card";
import { FilteredToken } from "@/lib/types";
import TokenRow from "./token-row";
import SolanaRow from "./solana-row";

type TokenListProps = {
  solBalance: number;
  tokens: FilteredToken[];
  rpcUrl: string;
  multisigPda: string;
  vaultIndex: number;
  programId?: string;
  cluster?: string;
};

export function TokenList({
  solBalance,
  tokens,
  rpcUrl,
  multisigPda,
  vaultIndex,
  programId,
  cluster,
}: TokenListProps) {
  return (
    <Card className="font-neue dark:bg-darkforeground dark:border-darkborder/10">
      <CardHeader>
        <CardTitle className="tracking-wide">Assets</CardTitle>
        <CardDescription className="text-stone-500 dark:text-white/50">
          Current token assets in your vault.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-6">
          <SolanaRow
            rpcUrl={rpcUrl}
            multisig={multisigPda}
            solanaBalance={solBalance}
            vaultIndex={vaultIndex}
            programId={programId}
            cluster={cluster}
          />
          {tokens
            .sort((a, b) => {
              if (!a.symbol && b.symbol) return 1;
              if (a.symbol && !b.symbol) return -1;
              return 0;
            })
            .map((token, i) => (
              <TokenRow
                key={i}
                token={token}
                rpcUrl={rpcUrl}
                multisig={multisigPda}
                vaultIndex={vaultIndex}
              />
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
