import { AccountInfo, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
import { USDC_MINT } from "../consts";

export async function getTotalBalance(
  connection: Connection,
  key: PublicKey,
  account: AccountInfo<Buffer>
) {
  try {
    const solanaPriceData = await fetch(
      `https://price.jup.ag/v6/price?ids=SOL`,
      {
        method: "GET",
      }
    ).then((res) => res.json());
    console.log(
      account.lamports / LAMPORTS_PER_SOL,
      solanaPriceData.data.SOL.price
    );
    let solanaUsdBalance =
      (account.lamports / LAMPORTS_PER_SOL) * solanaPriceData.data.SOL.price;

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
