"use client";
import {
  Connection,
  PublicKey,
  Transaction,
  clusterApiUrl,
} from "@solana/web3.js";
import { Button } from "./ui/button";
import * as multisig from "@sqds/multisig";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type RejectButtonProps = {
  rpcUrl: string;
  multisigPda: string;
  transactionIndex: number;
  proposalStatus: string;
};

const RejectButton = ({
  rpcUrl,
  multisigPda,
  transactionIndex,
  proposalStatus,
}: RejectButtonProps) => {
  const wallet = useWallet();
  const walletModal = useWalletModal();
  const router = useRouter();

  const connection = new Connection(rpcUrl || clusterApiUrl("mainnet-beta"), {
    commitment: "confirmed",
  });

  const validKinds = ["None", "Active", "Draft"];
  const isKindValid = validKinds.includes(proposalStatus);

  const rejectTransaction = async () => {
    if (!wallet.publicKey) {
      walletModal.setVisible(true);
      return;
    }
    let bigIntTransactionIndex = BigInt(transactionIndex);

    if (!isKindValid) {
      toast.error("You can't reject this proposal.");
      return;
    }

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
    const rejectProposalInstruction = multisig.instructions.proposalReject({
      multisigPda: new PublicKey(multisigPda),
      member: wallet.publicKey,
      transactionIndex: bigIntTransactionIndex,
    });

    transaction.add(rejectProposalInstruction);

    const signature = await wallet.sendTransaction(transaction, connection, {
      skipPreflight: true,
    });
    console.log("Transaction signature", signature);
    toast.success("Transaction submitted.");
    await connection.confirmTransaction(signature, "confirmed");
    toast.success("Transaction executed.");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.refresh();
  };
  return (
    <Button
      disabled={!isKindValid}
      onClick={rejectTransaction}
      className="mr-2"
    >
      Reject
    </Button>
  );
};

export default RejectButton;
