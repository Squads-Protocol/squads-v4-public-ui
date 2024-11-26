import * as multisig from "@sqds/multisig";
import { Connection, PublicKey } from "@solana/web3.js";
import { CachedData, Member, MultisigInfo } from "../types";
import { getTotalBalance } from "./getTotalBalances";

export async function getCachedSquads(
  connection: Connection,
  payload: CachedData
) {
  const cachedSquads: MultisigInfo[] = await Promise.all(
    payload.multisigs.map(async (m) => {
      const ms = new PublicKey(m.publicKey);
      const vault = new PublicKey(m.vault);

      const msInfo = await connection.getAccountInfo(ms);
      const vaultInfo = await connection.getAccountInfo(vault);

      const deser = multisig.accounts.Multisig.fromAccountInfo(msInfo!)[0];

      // Check if core config has changed, refresh on a case-by-case basis if needed
      let threshold: number;
      if (deser.pretty().threshold !== m.data.threshold) {
        threshold = deser.pretty().threshold;
      } else {
        threshold = m.data.threshold;
      }

      let members: Member[];
      if (deser.pretty().members.length !== m.data.members.length) {
        members = deser.pretty().members;
      } else {
        members = m.data.members;
      }

      let balance;
      try {
        // Get update vault balance info
        balance = {
          total: 0,
          solana: { balance: 0, usdAmount: 0 },
          usdc: { balance: 0, usdAmount: 0 },
        };
      } catch (e) {
        console.log(e);
        balance = {
          total: 0,
          solana: { balance: 0, usdAmount: 0 },
          usdc: { balance: 0, usdAmount: 0 },
        };
      }
      // Return with updated data if needed
      return {
        ...m,
        data: {
          ...m.data,
          members: members,
          threshold: threshold,
          serialize: deser.serialize,
          pretty: deser.pretty,
        },
        balance: balance,
      };
    })
  );

  return {
    multisigs: cachedSquads,
    ttl: payload.ttl,
  };
}
