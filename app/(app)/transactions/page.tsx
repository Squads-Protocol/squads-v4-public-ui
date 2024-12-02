import * as multisig from "@sqds/multisig";
import { cookies, headers } from "next/headers";
import TransactionsTable from "@/components/ui/table/transactions-table";
import SectionHeader from "@/components/layout/section-header";
import { useCluster } from "@/state/ClusterContext";
import { useTransactions } from "@/state/transactions";
import { useSquadMetadata } from "@/state/metadata";
import { clusterApiUrl, Connection } from "@solana/web3.js";

export default async function TransactionsPage({
  params,
  searchParams,
}: {
  params: {};
  searchParams: { page: string };
}) {
  const multisigCookie = headers().get("x-multisig");
  const vaultIndex = Number(headers().get("x-vault-index")) || 0;
  const programId =
    cookies().get("x-program-id")?.value || multisig.PROGRAM_ID.toBase58();

  // const multisigCookie = headers().get("x-multisig");
  // const multisigPda = new PublicKey(multisigCookie!);

  // const cluster = await getClusterName(rpcUrl!);

  // const multisigInfo = await multisig.accounts.Multisig.fromAccountAddress(
  //   connection,
  //   multisigPda
  // );

  // const transactionIndex = Number(multisigInfo.transactionIndex);
  /*
  const latestTransactions = await getRecentTransactions(
    connection,
    multisigPda,
    transactionIndex,
    page
  );
  */

  return (
    <div>
      <SectionHeader
        title="Transactions"
        description="View recent transactions for your Squad."
      />
      <section className="px-8 my-14">
        {!multisigCookie || !programId ? (
          <div>loading...</div>
        ) : (
          <TransactionsTable
            multisigPda={multisigCookie!}
            vaultIndex={vaultIndex}
            programId={programId}
            page={parseInt(searchParams.page) || 1}
          />
        )}
      </section>
    </div>
  );
}
