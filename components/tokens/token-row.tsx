import Image from "next/image";
import SendTokens from "./send-token";
import { nWithCommas } from "@/lib/nFormatter";
import { ChipWithLink } from "../ui/chip";

export default function TokenRow({
  token,
  rpcUrl,
  multisig,
  vaultIndex,
}: {
  token: any;
  rpcUrl: string;
  multisig: string;
  vaultIndex: number;
}) {
  return (
    <div className="w-full">
      <hr className="mb-6 border-darkborder/10" />
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
              <div className="flex gap-2 items-center">
                {token.symbol ? (
                  <p className="text-sm font-neuemedium leading-none text-stone-700 dark:text-white">
                    {token.symbol}
                  </p>
                ) : (
                  <p className="text-sm font-medium leading-none text-stone-700 dark:text-white">
                    Unknown Token
                  </p>
                )}
                <ChipWithLink
                  label={token.mint.slice(0, 4) + "..." + token.mint.slice(-4)}
                  href=""
                  color="muted"
                />
              </div>
              <div className="flex items-baseline gap-1">
                <p className="text-xs text-stone-500 dark:text-white/50 font-neue">
                  Balance:{" "}
                  {nWithCommas(
                    token.account.data.parsed.info.tokenAmount.uiAmount.toFixed(
                      3
                    )
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="ml-auto">
          <SendTokens
            mint={token.account.data.parsed.info.mint}
            tokenAccount={token.pubkey.toBase58()}
            decimals={token.account.data.parsed.info.tokenAmount.decimals}
            symbol={token.symbol || token.account.data.parsed.info.symbol}
            icon={token.icon || null}
            rpcUrl={rpcUrl}
            multisigPda={multisig}
            vaultIndex={vaultIndex}
          />
        </div>
      </div>
    </div>
  );
}
