import * as web3 from "@solana/web3.js";
import * as multisig from "@sqds/multisig";
import { Member } from "../types";

export async function createMultisig(
  connection: web3.Connection,
  user: web3.PublicKey,
  members: Member[],
  threshold: number,
  createKey: web3.PublicKey,
  rentCollector?: web3.PublicKey,
  configAuthority?: web3.PublicKey,
  programId?: string,
  metadata?: {
    name: string;
    description: string;
    uri: string;
  }
) {
  try {
    const multisigPda = multisig.getMultisigPda({
      createKey,
      programId: programId
        ? new web3.PublicKey(programId)
        : multisig.PROGRAM_ID,
    })[0];

    const [programConfig] = multisig.getProgramConfigPda({
      programId: programId
        ? new web3.PublicKey(programId)
        : multisig.PROGRAM_ID,
    });

    const programConfigInfo =
      await multisig.accounts.ProgramConfig.fromAccountAddress(
        connection,
        programConfig
      );

    const configTreasury = programConfigInfo.treasury;

    const ix = multisig.instructions.multisigCreateV2({
      multisigPda: multisigPda,
      createKey: createKey,
      creator: user,
      members: members as Member[],
      threshold: threshold,
      configAuthority: configAuthority ? configAuthority : null,
      treasury: configTreasury,
      rentCollector: rentCollector ? rentCollector : null,
      timeLock: 0,
      programId: programId
        ? new web3.PublicKey(programId)
        : multisig.PROGRAM_ID,
    });

    const tx = new web3.Transaction().add(ix);

    if (metadata) {
      tx.add(
        new web3.TransactionInstruction({
          keys: [{ pubkey: user, isSigner: true, isWritable: true }],
          data: Buffer.from(
            `{'name':'${metadata.name}', 'description':'${metadata.description}', 'imageUri':'https://i.imgur.com/xYKO8Vk.png'}`,
            "utf-8"
          ),
          programId: new web3.PublicKey(
            "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
          ),
        })
      );
    }

    tx.feePayer = user;
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    return { transaction: tx, multisig: multisigPda };
  } catch (err) {
    throw err;
  }
}
