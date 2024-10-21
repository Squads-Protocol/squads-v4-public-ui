import * as multisig from "@sqds/multisig";
import {
  Connection,
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { decodeAndDeserialize } from "./decodeAndDeserialize";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { toast } from "sonner";
import { loadLookupTables } from "./getAccountsForSimulation";

export const importTransaction = async (
  tx: string,
  connection: Connection,
  multisigPda: string,
  programId: string,
  vaultIndex: number,
  wallet: WalletContextState
) => {
  if (!wallet.publicKey) {
    throw "Please connect your wallet.";
  }
  try {
    const { message, version } = decodeAndDeserialize(tx);

    const multisigInfo = await multisig.accounts.Multisig.fromAccountAddress(
      connection,
      new PublicKey(multisigPda)
    );

    const transactionMessage = TransactionMessage.decompile(message);

    const addressLookupTableAccounts =
      version === 0
        ? await loadLookupTables(
            connection,
            transactionMessage.compileToV0Message()
          )
        : [];

    const transactionIndex = Number(multisigInfo.transactionIndex) + 1;
    const transactionIndexBN = BigInt(transactionIndex);

    const multisigTransactionIx = multisig.instructions.vaultTransactionCreate({
      multisigPda: new PublicKey(multisigPda),
      creator: wallet.publicKey,
      ephemeralSigners: 0,
      transactionMessage: transactionMessage,
      transactionIndex: transactionIndexBN,
      addressLookupTableAccounts,
      rentPayer: wallet.publicKey,
      vaultIndex: vaultIndex,
      programId: programId ? new PublicKey(programId) : multisig.PROGRAM_ID,
    });
    const proposalIx = multisig.instructions.proposalCreate({
      multisigPda: new PublicKey(multisigPda),
      creator: wallet.publicKey,
      isDraft: false,
      transactionIndex: transactionIndexBN,
      rentPayer: wallet.publicKey,
      programId: programId ? new PublicKey(programId) : multisig.PROGRAM_ID,
    });
    const approveIx = multisig.instructions.proposalApprove({
      multisigPda: new PublicKey(multisigPda),
      member: wallet.publicKey,
      transactionIndex: transactionIndexBN,
      programId: programId ? new PublicKey(programId) : multisig.PROGRAM_ID,
    });

    const blockhash = (await connection.getLatestBlockhash()).blockhash;

    const wrappedMessage = new TransactionMessage({
      instructions: [multisigTransactionIx, proposalIx, approveIx],
      payerKey: wallet.publicKey,
      recentBlockhash: blockhash,
    }).compileToV0Message();

    const transaction = new VersionedTransaction(wrappedMessage);

    const signature = await wallet.sendTransaction(transaction, connection, {
      skipPreflight: true,
    });
    console.log("Transaction signature", signature);
    toast.loading("Confirming...", {
      id: "transaction",
    });

    let sent = false;
    const maxAttempts = 10;
    const delayMs = 1000;
    for (let attempt = 0; attempt < maxAttempts && !sent; attempt++) {
      const status = await connection.getSignatureStatus(signature);
      if (status?.value?.confirmationStatus === "confirmed") {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        sent = true;
      } else {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  } catch (error) {
    console.error(error);
  }
};
