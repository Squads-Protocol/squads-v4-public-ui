"use client";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { Button } from "./ui/button";
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
};

const ApproveButton = ({
  rpcUrl,
  multisigPda,
  transactionIndex,
  proposalStatus,
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
  const connection = new Connection(rpcUrl, { commitment: "confirmed" });

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
      });
      transaction.add(createProposalInstruction);
    }
    if (proposalStatus == "Draft") {
      const activateProposalInstruction =
        multisig.instructions.proposalActivate({
          multisigPda: new PublicKey(multisigPda),
          member: wallet.publicKey,
          transactionIndex: bigIntTransactionIndex,
        });
      transaction.add(activateProposalInstruction);
    }
    const approveProposalInstruction = multisig.instructions.proposalApprove({
      multisigPda: new PublicKey(multisigPda),
      member: wallet.publicKey,
      transactionIndex: bigIntTransactionIndex,
    });
    transaction.add(approveProposalInstruction);
    const signature = await wallet.sendTransaction(transaction, connection, {
      skipPreflight: true,
    });
    console.log("Transaction signature", signature);
    toast.success("Approval submitted");
    await connection.confirmTransaction(signature, "confirmed");
    toast.success("Proposal approved");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.refresh();
  };
  return (
    <Button disabled={isKindValid} onClick={approveProposal} className="mr-2">
      Approve
    </Button>
  );
};

export default ApproveButton;
