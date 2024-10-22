import Link from "next/link";
import * as multisig from "@sqds/multisig";
import { TableCell, TableRow } from "../primitives/table";
import { createExplorerUrl } from "@/lib/helpers/createExplorerUrl";
import { PublicKey, clusterApiUrl } from "@solana/web3.js";
import ApproveButton from "@/components/ApproveButton";
import RejectButton from "@/components/RejectButton";
import ExecuteButton from "@/components/ExecuteButton";
import Chip from "../chip";
import CopyTextButton from "../misc/copy-text";
import { MultiProgress } from "../primitives/multi-progress";

interface TransactionTableRowProps {
  rpcUrl: string;
  multisigPda: string;
  programId: string;
  transaction: {
    transactionPda: [PublicKey, number];
    proposal: multisig.generated.Proposal | null;
    index: bigint;
  };
  threshold: number;
}

export default function TransactionTableRow({
  rpcUrl,
  multisigPda,
  programId,
  transaction,
  threshold,
}: TransactionTableRowProps) {
  return (
    <TableRow className="border-darkborder/30 hover:bg-white/[0.03]">
      <TableCell className="font-neuemedium">
        {Number(transaction.index)}
      </TableCell>
      <TableCell className="text-blue-500 font-neue">
        <div className="inline-flex gap-2 items-center">
          <Link
            href={createExplorerUrl(
              transaction.transactionPda[0].toBase58(),
              rpcUrl || clusterApiUrl("mainnet-beta")
            )}
          >
            {transaction.transactionPda[0].toBase58().slice(0, 4) +
              "..." +
              transaction.transactionPda[0].toBase58().slice(-4)}
          </Link>
          <CopyTextButton text={transaction.transactionPda[0].toBase58()} />
        </div>
      </TableCell>
      <TableCell className="font-neue">
        <MultiProgress
          approved={transaction.proposal?.approved.length || 0}
          rejected={transaction.proposal?.rejected.length || 0}
          max={threshold}
          className="w-64"
        />
      </TableCell>
      <TableCell className="font-neue">
        {showStatusChip(transaction.proposal?.status.__kind || "None")}
      </TableCell>
      <TableCell className="font-neue">
        {showActionButton(
          transaction.proposal?.status.__kind || "None",
          rpcUrl,
          multisigPda,
          programId,
          transaction
        )}
      </TableCell>
    </TableRow>
  );
}

// "Draft" | "Active" | "Rejected" | "Approved" | "Executing" | "Executed" | "Cancelled"
function showActionButton(
  proposalStatus: string,
  rpcUrl: string,
  multisigPda: string,
  programId: string,
  transaction: {
    transactionPda: [PublicKey, number];
    proposal: multisig.generated.Proposal | null;
    index: bigint;
  }
) {
  switch (proposalStatus) {
    case "Draft":
      return <>Create Proposal</>;
    case "Active":
      return (
        <>
          <ApproveButton
            rpcUrl={rpcUrl!}
            multisigPda={multisigPda!}
            transactionIndex={Number(transaction.index)}
            proposalStatus={transaction.proposal?.status.__kind || "None"}
            programId={programId}
          />
          <RejectButton
            rpcUrl={rpcUrl!}
            multisigPda={multisigPda!}
            transactionIndex={Number(transaction.index)}
            proposalStatus={transaction.proposal?.status.__kind || "None"}
            programId={programId}
          />
        </>
      );
    case "Rejected":
      return <>Reject Proposal</>;
    case "Approved":
      return (
        <ExecuteButton
          rpcUrl={rpcUrl!}
          multisigPda={multisigPda!}
          transactionIndex={Number(transaction.index)}
          proposalStatus={transaction.proposal?.status.__kind || "None"}
          programId={programId}
        />
      );
    case "Executing":
      return (
        <ExecuteButton
          rpcUrl={rpcUrl!}
          multisigPda={multisigPda!}
          transactionIndex={Number(transaction.index)}
          proposalStatus={transaction.proposal?.status.__kind || "None"}
          programId={programId}
        />
      );
    case "Executed":
      return (
        <ExecuteButton
          rpcUrl={rpcUrl!}
          multisigPda={multisigPda!}
          transactionIndex={Number(transaction.index)}
          proposalStatus={transaction.proposal?.status.__kind || "None"}
          programId={programId}
        />
      );
    case "Cancelled":
      return <>Cancelled</>;
    default:
      return <>Unknown</>;
  }
}

function showStatusChip(proposalStatus: string) {
  switch (proposalStatus) {
    case "Draft":
      return <Chip label="Draft" color="stone" />;
    case "Active":
      return <Chip label="Active" color="blue" />;
    case "Rejected":
      return <Chip label="Rejected" color="red" />;
    case "Approved":
      return <Chip label="Approved" color="green" />;
    case "Executing":
      return <Chip label="Executing" color="orange" />;
    case "Executed":
      return <Chip label="Executed" color="green" />;
    case "Cancelled":
      return <Chip label="Cancelled" color="red" />;
    default:
      return <Chip label="Unknown" color="stone" />;
  }
}
