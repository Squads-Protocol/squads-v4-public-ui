import * as multisig from "@sqds/multisig";
import { headers } from "next/headers";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Link from "next/link";
import ApproveButton from "@/components/ApproveButton";
import ExecuteButton from "@/components/ExecuteButton";
import RejectButton from "@/components/RejectButton";
import { Suspense } from "react";

export default async function TransactionsPage({
  params,
  searchParams,
}: {
  params: {};
  searchParams: { page: string };
}) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const rpcUrl = headers().get("x-rpc-url");
  const connection = new Connection(rpcUrl || clusterApiUrl("mainnet-beta"));
  const multisigCookie = headers().get("x-multisig");
  const multisigPda = new PublicKey(multisigCookie!);
  const vaultIndex = Number(headers().get("x-vault-index"));
  const programIdCookie = headers().get("x-program-id");
  const programId = new PublicKey(programIdCookie!);

  const multisigInfo = await multisig.accounts.Multisig.fromAccountAddress(
    connection,
    multisigPda
  );

  const transactionIndexBN = multisigInfo.transactionIndex;
  let transactionIndex = Number(transactionIndexBN);
  const transactionsPerPage = 4;

  // Ensure startingTransactionIndex is at least 1
  let startingTransactionIndex = Math.max(
    1,
    transactionIndex - (page - 1) * transactionsPerPage
  );

  let latestTransactions = [];
  for (let i = 0; i < transactionsPerPage; i++) {
    let usingTransactionIndex = startingTransactionIndex - i;

    // Ensure usingTransactionIndex does not go below 1
    if (usingTransactionIndex < 1) break; // Stop fetching if the index is out of valid range

    let index = BigInt(usingTransactionIndex);
    const transactionPda = multisig.getTransactionPda({
      multisigPda,
      index,
      programId: programId ? new PublicKey(programId) : multisig.PROGRAM_ID,
    });
    const proposalPda = multisig.getProposalPda({
      multisigPda,
      transactionIndex: index,
      programId: programId ? new PublicKey(programId) : multisig.PROGRAM_ID,
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

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Transactions</h1>

      <Suspense fallback={<div>Loading...</div>}>
        <Table>
          <TableCaption>A list of your recent transactions.</TableCaption>
          <TableCaption>Page: {searchParams.page || 1}.</TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead>Index</TableHead>
              <TableHead>Public Key</TableHead>
              <TableHead>Proposal Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {latestTransactions.map((transaction, index) => (
              <TableRow key={index}>
                <TableCell>{Number(transaction.index)}</TableCell>
                <TableCell className="text-blue-500">
                  <Link
                    href={createSolanaExplorerUrl(
                      transaction.transactionPda[0].toBase58(),
                      rpcUrl || clusterApiUrl("mainnet-beta")
                    )}
                  >
                    {transaction.transactionPda[0].toBase58()}
                  </Link>
                </TableCell>
                <TableCell>
                  {transaction.proposal?.status.__kind || "None"}
                </TableCell>
                <TableCell>
                  <ApproveButton
                    rpcUrl={rpcUrl!}
                    multisigPda={multisigCookie!}
                    transactionIndex={transactionIndex}
                    proposalStatus={
                      transaction.proposal?.status.__kind || "None"
                    }
                    programId={
                      programIdCookie
                        ? programIdCookie
                        : multisig.PROGRAM_ID.toBase58()
                    }
                  />
                  <RejectButton
                    rpcUrl={rpcUrl!}
                    multisigPda={multisigCookie!}
                    transactionIndex={transactionIndex}
                    proposalStatus={
                      transaction.proposal?.status.__kind || "None"
                    }
                    programId={
                      programIdCookie
                        ? programIdCookie
                        : multisig.PROGRAM_ID.toBase58()
                    }
                  />
                  <ExecuteButton
                    rpcUrl={rpcUrl!}
                    multisigPda={multisigCookie!}
                    transactionIndex={transactionIndex}
                    proposalStatus={
                      transaction.proposal?.status.__kind || "None"
                    }
                    programId={
                      programIdCookie
                        ? programIdCookie
                        : multisig.PROGRAM_ID.toBase58()
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Suspense>

      <Pagination>
        <PaginationContent>
          {searchParams.page != "1" && (
            <PaginationItem>
              <PaginationPrevious href={`/transactions?page=${page - 1}`} />
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationNext href={`/transactions?page=${page + 1}`} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

function createSolanaExplorerUrl(publicKey: string, rpcUrl: string): string {
  const baseUrl = "https://explorer.solana.com/address/";
  const clusterQuery = "?cluster=custom&customUrl=";
  const encodedRpcUrl = encodeURIComponent(rpcUrl);

  return `${baseUrl}${publicKey}${clusterQuery}${encodedRpcUrl}`;
}
