import * as multisig from "@sqds/multisig";
import { cookies, headers } from "next/headers";
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
import CreateTransaction from "@/components/CreateTransactionButton";
import { redirect } from "next/navigation";

const TRANSACTIONS_PER_PAGE = 10;

interface ActionButtonsProps {
  rpcUrl: string;
  multisigPda: string;
  transactionIndex: number;
  proposalStatus: string;
  programId: PublicKey;
}

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
  const programIdCookie = cookies().get("x-program-id")
    ? cookies().get("x-program-id")?.value
    : multisig.PROGRAM_ID.toString();
  const programId = programIdCookie
    ? new PublicKey(programIdCookie!)
    : multisig.PROGRAM_ID;

  const multisigInfo = await multisig.accounts.Multisig.fromAccountAddress(
    connection,
    multisigPda
  );
  const totalTransactions = Number(multisigInfo.transactionIndex);
  const totalPages = Math.ceil(totalTransactions / TRANSACTIONS_PER_PAGE);

  if (page > totalPages) {
    // Redirect to the last valid page if the requested page is out of range
    redirect(`/transactions?page=${totalPages}`);
  }

  const startIndex = totalTransactions - (page - 1) * TRANSACTIONS_PER_PAGE;
  const endIndex = Math.max(startIndex - TRANSACTIONS_PER_PAGE + 1, 1);

  const latestTransactions = await Promise.all(
    Array.from({ length: startIndex - endIndex + 1 }, (_, i) => {
      const index = BigInt(startIndex - i);
      return fetchTransactionData(connection, multisigPda, index, programId);
    })
  );

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <CreateTransaction
          rpcUrl={rpcUrl}
          multisigPda={multisigCookie!}
          vaultIndex={vaultIndex}
          programId={programIdCookie}
        />
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <Table>
          <TableCaption>A list of your recent transactions.</TableCaption>
          <TableCaption>
            Page: {page} of {totalPages}
          </TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead>Index</TableHead>
              <TableHead>Public Key</TableHead>
              <TableHead>Proposal Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          {latestTransactions.length > 0 ? (
            <TableBody>
              {latestTransactions.map((transaction, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{Number(transaction.index)}</TableCell>
                    <TableCell className="text-blue-500">
                      <Link
                        href={createSolanaExplorerUrl(
                          transaction.transactionPda[0].toBase58(),
                          rpcUrl!
                        )}
                      >
                        {transaction.transactionPda[0].toBase58()}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {transaction.proposal?.status.__kind || "Active"}
                    </TableCell>
                    <TableCell>
                      <ActionButtons
                        rpcUrl={rpcUrl!}
                        multisigPda={multisigCookie!}
                        transactionIndex={Number(transaction.index)}
                        proposalStatus={
                          transaction.proposal?.status.__kind || "Active"
                        }
                        programId={programId}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          ) : (
            <TableBody>
              <TableRow>
                <TableCell colSpan={5}>No transactions found.</TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </Suspense>

      <Pagination>
        <PaginationContent>
          {page > 1 && (
            <PaginationItem>
              <PaginationPrevious href={`/transactions?page=${page - 1}`} />
            </PaginationItem>
          )}
          {page < totalPages && (
            <PaginationItem>
              <PaginationNext href={`/transactions?page=${page + 1}`} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}

async function fetchTransactionData(
  connection: Connection,
  multisigPda: PublicKey,
  index: bigint,
  programId: PublicKey
) {
  const transactionPda = multisig.getTransactionPda({
    multisigPda,
    index,
    programId,
  });
  const proposalPda = multisig.getProposalPda({
    multisigPda,
    transactionIndex: index,
    programId,
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

  return { transactionPda, proposal, index };
}

function ActionButtons({
  rpcUrl,
  multisigPda,
  transactionIndex,
  proposalStatus,
  programId,
}: ActionButtonsProps) {
  return (
    <>
      <ApproveButton
        rpcUrl={rpcUrl}
        multisigPda={multisigPda}
        transactionIndex={transactionIndex}
        proposalStatus={proposalStatus}
        programId={programId.toBase58()}
      />
      <RejectButton
        rpcUrl={rpcUrl}
        multisigPda={multisigPda}
        transactionIndex={transactionIndex}
        proposalStatus={proposalStatus}
        programId={programId.toBase58()}
      />
      <ExecuteButton
        rpcUrl={rpcUrl}
        multisigPda={multisigPda}
        transactionIndex={transactionIndex}
        proposalStatus={proposalStatus}
        programId={programId.toBase58()}
      />
    </>
  );
}

function createSolanaExplorerUrl(publicKey: string, rpcUrl: string): string {
  const baseUrl = "https://explorer.solana.com/address/";
  const clusterQuery = "?cluster=custom&customUrl=";
  const encodedRpcUrl = encodeURIComponent(rpcUrl);

  return `${baseUrl}${publicKey}${clusterQuery}${encodedRpcUrl}`;
}
