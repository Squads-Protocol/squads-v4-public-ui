import { AccountInfo, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
import { USDC_MINT } from "../consts";
import { TotalBalancesReturn } from "../types";

export async function getTotalBalance(
  connection: Connection,
  key: PublicKey,
  account: AccountInfo<Buffer>
): Promise<TotalBalancesReturn> {
  try {
    const solanaPriceData = await fetch(
      `https://price.jup.ag/v6/price?ids=SOL`,
      {
        method: "GET",
      }
    ).then((res) => res.json());

    let solanaUsdBalance;
    if (!solanaPriceData.data) {
      solanaUsdBalance = 0;
    } else {
      solanaUsdBalance =
        (account.lamports / LAMPORTS_PER_SOL) * solanaPriceData.data.SOL.price;
    }

    const usdcAccount = await connection.getParsedTokenAccountsByOwner(key, {
      mint: new PublicKey(USDC_MINT),
    });
    let usdcBalance = (
      await connection.getTokenAccountBalance(usdcAccount.value[0].pubkey)
    ).value.uiAmount;

    if (!usdcBalance) usdcBalance = 0;

    return {
      total: solanaUsdBalance + usdcBalance,
      solana: {
        balance: account.lamports / LAMPORTS_PER_SOL,
        usdAmount: solanaUsdBalance,
      },
      usdc: {
        balance: usdcBalance,
        usdAmount: usdcBalance,
      },
    };
  } catch (err) {
    throw err;
  }
}