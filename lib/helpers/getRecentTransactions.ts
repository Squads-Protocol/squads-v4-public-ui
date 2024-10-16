"use server";
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

  let startingTransactionIndex = Math.max(
    1,
    transactionIndex - (page - 1) * TRANSACTIONS_PER_PAGE
  );

  let latestTransactions = [];
  for (let i = 0; i < TRANSACTIONS_PER_PAGE; i++) {
    let usingTransactionIndex = startingTransactionIndex - i;

    if (usingTransactionIndex < 1) break;

    let index = BigInt(usingTransactionIndex);
    const transactionPda = multisig.getTransactionPda({
      multisigPda,
      index,
    });
    const proposalPda = multisig.getProposalPda({
      multisigPda,
      transactionIndex: index,
    });

    let proposal;
    try {
      proposal = await multisig.accounts.Proposal.fromAccountAddress(
        connection,
        proposalPda[0]
      );
    } catch (error) {
      proposal = null;
    }

    latestTransactions.push({ transactionPda, proposal, index });
  }

  return latestTransactions;
}
