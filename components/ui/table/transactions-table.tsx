import * as multisig from "@sqds/multisig";
import { Suspense } from "react";
import { Table, TableBody } from "../primitives/table";
import PaginationSection from "./pagination";
import TableHeadSection from "./table-head";
import TransactionTableRow from "./transaction-table-row";
import { PublicKey } from "@solana/web3.js";
import { Skeleton } from "../primitives/skeleton";

interface TransactionsTableProps {
  rpcUrl: string;
  multisigPda: string;
  programId: string;
  searchParams: { page: string };
  transactions: {
    transactionPda: [PublicKey, number];
    proposal: multisig.generated.Proposal | null;
    index: bigint;
  }[];
}

export default function TransactionsTable({
  rpcUrl,
  multisigPda,
  programId,
  searchParams,
  transactions,
}: TransactionsTableProps) {
  return (
    <>
      <Suspense fallback={<Skeleton className="w-full h-64 rounded-lg" />}>
        <div className="rounded-md border border-darkborder/30">
          <Table>
            <TableHeadSection page={searchParams.page} />
            <TableBody>
              {transactions.map((transaction, index) => (
                <TransactionTableRow
                  key={index}
                  rpcUrl={rpcUrl!}
                  multisigPda={multisigPda!}
                  programId={programId}
                  transaction={transaction}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </Suspense>

      <PaginationSection
        page={searchParams.page}
        transactionsLength={transactions.length}
      />
    </>
  );
}
