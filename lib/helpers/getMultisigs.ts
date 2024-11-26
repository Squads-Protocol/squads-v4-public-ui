import * as bs58 from "bs58";
import * as multisig from "@sqds/multisig";
import { Connection, PublicKey } from "@solana/web3.js";
import { AccountInfo } from "@solana/web3.js";
import { PROGRAM_ID } from "@sqds/multisig";
import { MultisigInfo } from "../types";
import { sleep } from "./sleep";

export async function getMultisigs(connection: Connection, key: PublicKey) {
  try {
    let multisigs: {
      account: AccountInfo<Buffer>;
      publickey: PublicKey;
    }[] = [];

    try {
      const result = await connection.getProgramAccounts(PROGRAM_ID, {
        filters: [
          {
            memcmp: {
              offset: 0,
              bytes: bs58.default.encode(
                multisig.accounts.multisigDiscriminator
              ),
            },
          },
        ],
      });

      if (result.length > 0) {
        multisigs = result.map((m) => ({
          account: m.account,
          publickey: m.pubkey,
        }));
      }
      await sleep(500);
    } catch (e) {
      console.error(e);
    }

    const deserializedAccounts = await Promise.all(
      multisigs
        .map((m) => multisig.accounts.Multisig.fromAccountInfo(m.account)[0])
        .filter((deser) => deser.members.some((mem) => mem.key.equals(key))) // Filter here first
        .map(async (deser) => {
          const [multisigPda] = multisig.getMultisigPda({
            createKey: new PublicKey(deser.pretty().createKey),
          });

          const [vaultPda] = multisig.getVaultPda({
            multisigPda,
            index: 0,
          });

          const balance = {
            total: 0,
            solana: { balance: 0, usdAmount: 0 },
            usdc: { balance: 0, usdAmount: 0 },
          };

          let ms: MultisigInfo = {
            publicKey: multisigPda.toBase58(),
            vault: vaultPda.toBase58(),
            balance: balance,
            data: {
              ...deser,
              serialize: deser.serialize,
              pretty: deser.pretty,
            },
          };

          return ms;
        })
    );

    return deserializedAccounts;
  } catch (err) {
    throw err;
  }
}
