'use client';

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
import { useSearchParams } from 'next/navigation';

const TRANSACTIONS_PER_PAGE = 5;

export default function TransactionsPage() {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const page = pageParam ? parseInt(pageParam) : 1;
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
              transactions={transactions}
              programId={programId!.toBase58()}
            />
          </Suspense>
        </Table>
      </Suspense>

      <Pagination>
        <PaginationContent>
          {page > 1 && <PaginationPrevious href={`/transactions?page=${page - 1}`} />}
          {page < totalPages && <PaginationNext href={`/transactions?page=${page + 1}`} />}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
