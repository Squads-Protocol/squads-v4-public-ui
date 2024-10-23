import * as multisig from "@sqds/multisig";
import ApproveButton from "./ApproveButton";
import ExecuteButton from "./ExecuteButton";
import RejectButton from "./RejectButton";
import { TableBody, TableCell, TableRow } from "./ui/table";
import Link from "next/link";

interface ActionButtonsProps {
  rpcUrl: string;
  multisigPda: string;
  transactionIndex: number;
  proposalStatus: string;
  programId: string;
}

export default function TransactionTable({
  multisigPda,
  rpcUrl,
  transactions,
  programId,
}: {
  multisigPda: string;
  rpcUrl: string;
  transactions: {
    transactionPda: string;
    proposal: multisig.generated.Proposal | null;
    index: bigint;
  }[];
  programId?: string;
}) {
  if (transactions.length === 0) {
    <TableBody>
      <TableRow>
        <TableCell colSpan={5}>No transactions found.</TableCell>
      </TableRow>
    </TableBody>;
  }
  return (
    <TableBody>
      {transactions.map((transaction, index) => {
        return (
          <TableRow key={index}>
            <TableCell>{Number(transaction.index)}</TableCell>
            <TableCell className="text-blue-500">
              <Link
                href={createSolanaExplorerUrl(
                  transaction.transactionPda,
                  rpcUrl!
                )}
              >
                {transaction.transactionPda}
              </Link>
            </TableCell>
            <TableCell>
              {transaction.proposal?.status.__kind || "Active"}
            </TableCell>
            <TableCell>
              <ActionButtons
                rpcUrl={rpcUrl!}
                multisigPda={multisigPda!}
                transactionIndex={Number(transaction.index)}
                proposalStatus={transaction.proposal?.status.__kind || "Active"}
                programId={
                  programId ? programId : multisig.PROGRAM_ID.toBase58()
                }
              />
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  );
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
        programId={programId}
      />
      <RejectButton
        rpcUrl={rpcUrl}
        multisigPda={multisigPda}
        transactionIndex={transactionIndex}
        proposalStatus={proposalStatus}
        programId={programId}
      />
      <ExecuteButton
        rpcUrl={rpcUrl}
        multisigPda={multisigPda}
        transactionIndex={transactionIndex}
        proposalStatus={proposalStatus}
        programId={programId}
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
