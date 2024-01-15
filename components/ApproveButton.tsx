"use client";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { Button } from "./ui/button";
import * as multisig from "@sqds/multisig";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { toast } from "sonner";

type ApproveButtonProps = {
  connection: string;
  multisigPda: string;
  transactionIndex: number;
  proposalStatus: string;
};

const ApproveButton = ({
  connection,
  multisigPda,
  transactionIndex,
  proposalStatus,
}: ApproveButtonProps) => {
  const wallet = useWallet();
  const walletModal = useWalletModal();
  const validKinds = [
    "Rejected",
    "Approved",
    "Executing",
    "Executed",
    "Cancelled",
  ];
  const isKindValid = validKinds.includes(proposalStatus || "None");

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
    const signature = await wallet.sendTransaction(
      transaction,
      new Connection(connection, { commitment: "confirmed" }),
      {
        skipPreflight: true,
      }
    );
    console.log("Transaction signature", signature);
  };
  return (
    <Button disabled={isKindValid} onClick={approveProposal} className="mr-2">
      Approve
    </Button>
  );
};

export default ApproveButton;
