'use client';
import { PublicKey } from '@solana/web3.js';
import { Table, TableCaption, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Suspense } from 'react';
import CreateTransaction from '@/components/CreateTransactionButton';
import TransactionTable from '@/components/TransactionTable';
import { useMultisig, useTransactions } from '@/hooks/useServices';
import { useMultisigData } from '@/hooks/useMultisigData';

const TRANSACTIONS_PER_PAGE = 20;

interface ActionButtonsProps {
  rpcUrl: string;
  multisigPda: string;
  transactionIndex: number;
  proposalStatus: string;
  programId: PublicKey;
}

export default function TransactionsPage({
  params,
  searchParams,
}: {
  params: {};
  searchParams: { page: string };
}) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const { rpcUrl, connection, multisigAddress, vaultIndex, programId, multisigVault } =
    useMultisigData();

  const { data } = useMultisig();

  const totalTransactions = Number(data ? data.transactionIndex : 0);
  const totalPages = Math.ceil(totalTransactions / TRANSACTIONS_PER_PAGE);

  /*
  if (page > totalPages) {
    redirect(`/transactions?page=0`);
  }
  */

  const startIndex = totalTransactions - (page - 1) * TRANSACTIONS_PER_PAGE;
  const endIndex = Math.max(startIndex - TRANSACTIONS_PER_PAGE + 1, 1);

  const { data: latestTransactions } = useTransactions(startIndex, endIndex);

  const transactions = (latestTransactions || []).map((transaction) => {
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
          rpcUrl={rpcUrl!}
          multisigPda={multisigAddress!}
          vaultIndex={vaultIndex}
          programId={programId.toBase58()}
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
          <Suspense fallback={<div>Loading...</div>}>
            <TransactionTable
              multisigPda={multisigAddress!}
              rpcUrl={rpcUrl!}
              transactions={transactions}
              programId={programId!.toBase58()}
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
