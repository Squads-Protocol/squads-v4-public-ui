import * as multisig from "@sqds/multisig";
import { Connection, PublicKey } from "@solana/web3.js";
import { AccountInfo } from "@solana/web3.js";
import { PROGRAM_ID } from "@sqds/multisig";
import { MultisigInfo } from "../types";
import { sleep } from "./sleep";
import { getTotalBalance } from "./getTotalBalances";

const baseSize =
  8 + // anchor account discriminator
  32 + // create_key
  32 + // config_authority
  2 + // threshold
  4 + // time_lock
  8 + // transaction_index
  8 + // stale_transaction_index
  1 + // rent_collector Option discriminator
  32 + // rent_collector (always 32 bytes, even if None, just to keep the realloc logic simpler)
  1 + // bump
  4; // members vector length

export async function getMultisigs(connection: Connection, key: PublicKey) {
  try {
    let multisigs: {
      account: AccountInfo<Buffer>;
      publickey: PublicKey;
    }[] = [];
    let ix = 0;

    while (!multisigs.length && ix < 10) {
      try {
        const result = await connection.getProgramAccounts(PROGRAM_ID, {
          filters: [
            {
              memcmp: {
                offset: baseSize + ix * 33,
                bytes: key.toBase58(),
              },
            },
          ],
        });

        console.log(result);

        if (result.length > 0) {
          multisigs = result.map((m) => ({
            account: m.account,
            publickey: m.pubkey,
          }));
        }
        ix += 1;
        await sleep(500);
      } catch (e) {
        console.error(e);
      }
    }

    const deserializedAccounts = await Promise.all(
      multisigs.map(async (m) => {
        const deser = multisig.accounts.Multisig.fromAccountInfo(m.account)[0];

        const [multisigPda] = multisig.getMultisigPda({
          createKey: new PublicKey(deser.pretty().createKey),
        });

        const [vaultPda] = multisig.getVaultPda({
          multisigPda,
          index: 0,
        });

        const vaultInfo = await connection.getAccountInfo(vaultPda);

        const balance = vaultInfo
          ? await getTotalBalance(connection, vaultPda, vaultInfo)
          : {
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

        console.log(ms);

        return ms;
      })
    );

    return deserializedAccounts;
  } catch (err) {
    throw err;
  }
}
