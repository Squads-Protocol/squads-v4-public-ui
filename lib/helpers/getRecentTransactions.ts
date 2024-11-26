"use client";
import { Connection, PublicKey } from "@solana/web3.js";
import * as multisig from "@sqds/multisig";

const TRANSACTIONS_PER_PAGE = 10;

export async function getRecentTransactions(
  connection: Connection,
  multisigPda: PublicKey,
  transactionIndex: number,
  page: number
) {
  if (isNaN(page)) return [];
  if (isNaN(transactionIndex)) return [];

  const startIndex = transactionIndex - (page - 1) * TRANSACTIONS_PER_PAGE;

  let latestTransactions = [];
  for (let i = 0; i < TRANSACTIONS_PER_PAGE; i++) {
    const currentIndex = startIndex - i;

    if (currentIndex <= 0) break;

    const index = BigInt(currentIndex);

    const transactionPda = multisig.getTransactionPda({
      multisigPda,
      index,
    });
    const [proposalPda] = multisig.getProposalPda({
      multisigPda,
      transactionIndex: index,
    });

    let proposal;
    try {
      proposal = await multisig.accounts.Proposal.fromAccountAddress(
        connection,
        proposalPda
      );
    } catch (error) {
      proposal = null;
    }

    latestTransactions.push({ transactionPda, proposal, index });
  }

  return latestTransactions;
}
