import * as web3 from "@solana/web3.js";
import * as multisig from "@sqds/multisig";

export interface Member {
  key: web3.PublicKey | null;
  permissions: multisig.generated.Permissions;
}

export async function createMultisig(
  connection: web3.Connection,
  user: web3.PublicKey,
  members: Member[],
  threshold: number,
  createKey: web3.PublicKey,
  rentCollector?: web3.PublicKey,
  configAuthority?: web3.PublicKey
) {
  try {
    const multisigPda = multisig.getMultisigPda({
      createKey,
      programId: multisig.PROGRAM_ID,
    })[0];

    const [programConfig] = multisig.getProgramConfigPda({
      programId: multisig.PROGRAM_ID,
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
      members: members as any,
      threshold: threshold,
      configAuthority: configAuthority ? configAuthority : null,
      treasury: configTreasury,
      rentCollector: rentCollector ? rentCollector : null,
      timeLock: 0,
      programId: multisig.PROGRAM_ID,
    });

    const tx = new web3.Transaction().add(ix);

    tx.feePayer = user;
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    return { transaction: tx, multisig: multisigPda };
  } catch (err) {
    throw err;
  }
}
