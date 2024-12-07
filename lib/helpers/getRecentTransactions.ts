"use client";
import { Connection, PublicKey } from "@solana/web3.js";
import * as multisig from "@sqds/multisig";

const TRANSACTIONS_PER_PAGE = 10;

export async function getRecentTransactions(
  connection: Connection,
  multisigPda: PublicKey,
  transactionIndex: number,
  page: number,
  programId: string = multisig.PROGRAM_ID.toBase58(),
) {
  if (isNaN(page)) return [];
  if (isNaN(transactionIndex)) return [];

  const startIndex = transactionIndex - (page - 1) * TRANSACTIONS_PER_PAGE;
  console.log(startIndex);

  let latestTransactions = [];
  for (let i = 0; i < TRANSACTIONS_PER_PAGE; i++) {
    const currentIndex = startIndex - i;

    if (currentIndex <= 0) break;

    const index = BigInt(currentIndex);

    const transactionPda = multisig.getTransactionPda({
      multisigPda,
      index,
      programId: new PublicKey(programId),
    });
    const [proposalPda] = multisig.getProposalPda({
      multisigPda,
      transactionIndex: index,
      programId: new PublicKey(programId),
    });
    console.log(proposalPda);

    let proposal;
    try {
      proposal = await multisig.accounts.Proposal.fromAccountAddress(
        connection,
        proposalPda,
      );
    } catch (error) {
      console.error(error);
      proposal = null;
    }

    latestTransactions.push({ transactionPda, proposal, index });
  }

  return latestTransactions;
}
