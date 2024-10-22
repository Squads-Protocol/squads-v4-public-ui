import {
  AccountInfo,
  LAMPORTS_PER_SOL,
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
} from "./ui/primitives/card";
import SendTokens from "./SendTokensButton";
import { Coins } from "lucide-react";
import { FilteredToken } from "@/lib/types";
import Image from "next/image";
import SendSol from "./SendSolButton";

type TokenListProps = {
  solBalance: number;
  tokens: FilteredToken[];
  rpcUrl: string;
  multisigPda: string;
  vaultIndex: number;
  programId?: string;
};

export function TokenList({
  solBalance,
  tokens,
  rpcUrl,
  multisigPda,
  vaultIndex,
  programId,
}: TokenListProps) {
  return (
    <Card className="font-neue dark:bg-darkforeground dark:border-darkborder/30">
      <CardHeader>
        <CardTitle className="tracking-wide">Assets</CardTitle>
        <CardDescription className="text-stone-500 dark:text-white/50">
          Current token assets in your vault.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-6">
          <div className="flex items-center">
            <div className="">
              <div className="flex items-center gap-2">
                <Image
                  src={"/tokens/SOL.webp"}
                  width={30}
                  height={30}
                  alt="SOL Icon"
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex flex-col space-y-0.5 items-start justify-start">
                  <p className="text-sm font-neuemedium leading-none text-stone-700 dark:text-white">
                    SOL
                  </p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-xs text-stone-500 dark:text-white/50 font-neue">
                      Amount: {solBalance / LAMPORTS_PER_SOL}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="ml-auto">
              <SendSol
                rpcUrl={rpcUrl}
                multisigPda={multisigPda}
                vaultIndex={vaultIndex}
                programId={programId}
              />
            </div>
          </div>
          {tokens.map((token, i) => (
            <div key={i} className="w-full">
              <hr className="mb-6 border-darkborder/30" />
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex items-center gap-2">
                    {token.icon && (
                      <Image
                        src={token.icon}
                        width={30}
                        height={30}
                        alt="Token Icon"
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <div className="flex flex-col space-y-0.5 items-start justify-start">
                      {token.symbol ? (
                        <p className="text-sm font-neuemedium leading-none text-stone-700 dark:text-white">
                          {token.symbol}
                        </p>
                      ) : (
                        <p className="text-sm font-medium leading-none text-stone-700 dark:text-white">
                          Mint: {token.mint}
                        </p>
                      )}
                      <div className="flex items-baseline gap-1">
                        <p className="text-xs text-stone-500 dark:text-white/50 font-neue">
                          Amount:{" "}
                          {token.account.data.parsed.info.tokenAmount.uiAmount}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ml-auto">
                  <SendTokens
                    mint={token.account.data.parsed.info.mint}
                    tokenAccount={token.pubkey.toBase58()}
                    decimals={
                      token.account.data.parsed.info.tokenAmount.decimals
                    }
                    symbol={
                      token.symbol || token.account.data.parsed.info.symbol
                    }
                    icon={token.icon || null}
                    rpcUrl={rpcUrl}
                    multisigPda={multisigPda}
                    vaultIndex={vaultIndex}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
