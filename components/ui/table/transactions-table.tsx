"use client";

import { Suspense } from "react";
import { Table, TableBody } from "../primitives/table";
import PaginationSection from "./pagination";
import TableHeadSection from "./table-head";
import TransactionTableRow from "./transaction-table-row";
import { Skeleton } from "../primitives/skeleton";
import TransactionTableFallback from "./fallback";
import { useCluster } from "@/state/ClusterContext";
import { useSquadMetadata } from "@/state/metadata";
import { useTransactions } from "@/state/transactions";

interface TransactionsTableProps {
  multisigPda: string;
  vaultIndex: number;
  programId: string;
  page: number;
}

export default function TransactionsTable({
  multisigPda,
  vaultIndex,
  programId,
  page,
}: TransactionsTableProps) {
  const { rpc, connection, cluster } = useCluster();
  const { account } = useSquadMetadata(multisigPda!);
  const { transactions, isLoading } = useTransactions(
    multisigPda!,
    connection!,
    Number(account?.transactionIndex!),
    page ? page : 1
  );

  if (isLoading) {
    return <Skeleton className="w-full h-96 bg-neutral-600 rounded-lg" />;
  }

  if (!transactions || transactions.length === 0) {
    return <TransactionTableFallback rpc={rpc!} multisigAddr={multisigPda!} vaultIndex={vaultIndex} programId={programId!} />
  }

  return (
    <>
      <Suspense fallback={<Skeleton className="w-full h-64 rounded-lg" />}>
        <div className="rounded-md border border-darkborder/10">
          <Table>
            <TableHeadSection page={page.toString()!} />
            <TableBody>
              {transactions?.map((transaction, index) => (
                <TransactionTableRow
                  key={index}
                  rpcUrl={rpc!}
                  multisigPda={multisigPda!}
                  programId={programId}
                  transaction={transaction}
                  threshold={account?.threshold!}
                  cluster={cluster!}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </Suspense>

      <PaginationSection
        page={page.toString()!}
        transactionsLength={transactions?.length!}
      />
    </>
  );
}
