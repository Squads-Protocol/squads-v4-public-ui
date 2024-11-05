"use client";
import {
  Connection,
  PublicKey,
  Transaction,
  clusterApiUrl,
} from "@solana/web3.js";
import { Button } from "../ui/primitives/button";
import * as multisig from "@sqds/multisig";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type ApproveButtonProps = {
  rpcUrl: string;
  multisigPda: string;
  transactionIndex: number;
  proposalStatus: string;
  programId: string;
};

const ApproveButton = ({
  rpcUrl,
  multisigPda,
  transactionIndex,
  proposalStatus,
  programId,
}: ApproveButtonProps) => {
  const wallet = useWallet();
  const walletModal = useWalletModal();
  const router = useRouter();
  const validKinds = [
    "Rejected",
    "Approved",
    "Executing",
    "Executed",
    "Cancelled",
  ];
  const isKindValid = validKinds.includes(proposalStatus || "None");
  const connection = new Connection(rpcUrl || clusterApiUrl("mainnet-beta"), {
    commitment: "confirmed",
  });

  const approveProposal = async () => {
    if (!wallet.publicKey) {
      walletModal.setVisible(true);
      return;
    }
    let bigIntTransactionIndex = BigInt(transactionIndex);
    const transaction = new Transaction();
    if (proposalStatus === "None") {
      const createProposalInstruction = multisig.instructions.proposalCreate({
        multisigPda: new PublicKey(multisigPda),
        creator: wallet.publicKey,
        isDraft: false,
        transactionIndex: bigIntTransactionIndex,
        rentPayer: wallet.publicKey,
        programId: programId ? new PublicKey(programId) : multisig.PROGRAM_ID,
      });
      transaction.add(createProposalInstruction);
    }
    if (proposalStatus == "Draft") {
      const activateProposalInstruction =
        multisig.instructions.proposalActivate({
          multisigPda: new PublicKey(multisigPda),
          member: wallet.publicKey,
          transactionIndex: bigIntTransactionIndex,
          programId: programId ? new PublicKey(programId) : multisig.PROGRAM_ID,
        });
      transaction.add(activateProposalInstruction);
    }
    const approveProposalInstruction = multisig.instructions.proposalApprove({
      multisigPda: new PublicKey(multisigPda),
      member: wallet.publicKey,
      transactionIndex: bigIntTransactionIndex,
      programId: programId ? new PublicKey(programId) : multisig.PROGRAM_ID,
    });
    transaction.add(approveProposalInstruction);
    const signature = await wallet.sendTransaction(transaction, connection, {
      skipPreflight: true,
    });
    console.log("Transaction signature", signature);
    toast.loading("Confirming...", {
      id: "transaction",
    });
    await connection.getSignatureStatuses([signature]);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.refresh();
  };
  return (
    <Button
      disabled={isKindValid}
      onClick={() =>
        toast.promise(approveProposal, {
          id: "transaction",
          loading: "Loading...",
          success: "Transaction approved.",
          error: (e) => `Failed to approve: ${e}`,
        })
      }
      className="font-neue bg-gradient-to-br from-stone-600 to-stone-800 text-white dark:bg-gradient-to-br dark:from-white dark:to-stone-400 dark:text-stone-700 hover:bg-gradient-to-br hover:from-stone-600 hover:to-stone-700 disabled:text-stone-500 disabled:bg-gradient-to-br disabled:from-stone-800 disabled:to-stone-900 dark:disabled:bg-gradient-to-br dark:disabled:from-stone-300 dark:disabled:to-stone-500 dark:disabled:text-stone-700/50 dark:hover:bg-stone-100 transition duration-200"
    >
      Approve
    </Button>
  );
};

export default ApproveButton;
