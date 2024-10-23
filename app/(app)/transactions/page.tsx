import * as multisig from "@sqds/multisig";
import { cookies, headers } from "next/headers";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import PageHeader from "@/components/ui/layout/page-header";
import TransactionsTable from "@/components/ui/table/transactions-table";
import { getRecentTransactions } from "@/lib/helpers/getRecentTransactions";

export default async function TransactionsPage({
  params,
  searchParams,
}: {
  params: {};
  searchParams: { page: string };
}) {
  const rpcUrl = headers().get("x-rpc-url");
  const connection = new Connection(rpcUrl || clusterApiUrl("mainnet-beta"));

  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const multisigCookie = headers().get("x-multisig");
  const multisigPda = new PublicKey(multisigCookie!);
  const programIdCookie =
    cookies().get("x-program-id")?.value || multisig.PROGRAM_ID.toBase58();

  const multisigInfo = await multisig.accounts.Multisig.fromAccountAddress(
    connection,
    multisigPda
  );

  const transactionIndex = Number(multisigInfo.transactionIndex);
  const latestTransactions = await getRecentTransactions(
    connection,
    multisigPda,
    transactionIndex,
    page
  );

  const transactions = latestTransactions.map((transaction) => {
    return {
      ...transaction,
      transactionPda: transaction.transactionPda[0].toBase58(),
    };
  });

  return (
    <div>
      <PageHeader heading="Transactions" />
      <TransactionsTable
        rpcUrl={rpcUrl!}
        multisigPda={multisigCookie!}
        multisigInfo={multisigInfo}
        programId={programIdCookie}
        searchParams={searchParams}
        transactions={latestTransactions}
      />
    </div>
  );
}