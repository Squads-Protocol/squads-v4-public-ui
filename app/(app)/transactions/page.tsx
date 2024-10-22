import * as multisig from "@sqds/multisig";
import { cookies, headers } from "next/headers";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import {
  Table,
  TableCaption,
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
import { Suspense } from "react";
import CreateTransaction from "@/components/CreateTransactionButton";
import TransactionTable from "@/components/TransactionTable";

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
  const connection = new Connection(
    rpcUrl || clusterApiUrl("mainnet-beta"),
    "confirmed"
  );
  const multisigCookie = cookies().get("x-multisig")?.value;
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

  /*
  if (page > totalPages) {
    redirect(`/transactions?page=0`);
  }
  */

  const startIndex = totalTransactions - (page - 1) * TRANSACTIONS_PER_PAGE;
  const endIndex = Math.max(startIndex - TRANSACTIONS_PER_PAGE + 1, 1);

  const latestTransactions = await Promise.all(
    Array.from({ length: startIndex - endIndex + 1 }, (_, i) => {
      const index = BigInt(startIndex - i);
      return fetchTransactionData(connection, multisigPda, index, programId);
    })
  );

  const transactions = latestTransactions.map((transaction) => {
    return {
      ...transaction,
      transactionPda: transaction.transactionPda[0].toBase58(),
    };
  });

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
            Page: {totalPages > 0 ? page + 1 : 0} of {totalPages}
          </TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead>Index</TableHead>
              <TableHead>Public Key</TableHead>
              <TableHead>Proposal Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <Suspense fallback={<div>Loading...</div>}>
            <TransactionTable
              multisigPda={multisigCookie!}
              rpcUrl={rpcUrl!}
              transactions={transactions}
              programId={programIdCookie!}
            />
          </Suspense>
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
