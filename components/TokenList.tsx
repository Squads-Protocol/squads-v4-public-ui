import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import SendTokens from './SendTokensButton';
import SendSol from './SendSolButton';
import { useMultisigData } from '@/hooks/useMultisigData';
import { useBalance, useGetTokens } from '@/hooks/useServices';

type TokenListProps = {
  multisigPda: string;
};

export function TokenList({ multisigPda }: TokenListProps) {
  const { vaultIndex, programId } = useMultisigData();
  const { data: solBalance = 0 } = useBalance();
  const { data: tokens = null } = useGetTokens();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tokens</CardTitle>
        <CardDescription>The tokens you hold in your wallet</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div>
            <div className="flex items-center">
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">SOL</p>
                <p className="text-sm text-muted-foreground">
                  Amount: {solBalance ? solBalance / LAMPORTS_PER_SOL : 0}
                </p>
              </div>
              <div className="ml-auto">
                <SendSol multisigPda={multisigPda} vaultIndex={vaultIndex} />
              </div>
            </div>
            {tokens && tokens.value.length > 0 ? <hr className="mt-2" /> : null}
          </div>
          {tokens &&
            tokens.value.map((token) => (
              <div key={token.account.data.parsed.info.mint}>
                <div className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Mint: {token.account.data.parsed.info.mint}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Amount: {token.account.data.parsed.info.tokenAmount.uiAmount}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <SendTokens
                      mint={token.account.data.parsed.info.mint}
                      tokenAccount={token.pubkey.toBase58()}
                      decimals={token.account.data.parsed.info.tokenAmount.decimals}
                      multisigPda={multisigPda}
                      vaultIndex={vaultIndex}
                      programId={programId.toBase58()}
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
