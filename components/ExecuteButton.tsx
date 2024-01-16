"use client";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { Button } from "./ui/button";
import * as multisig from "@sqds/multisig";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type ExecuteButtonProps = {
  rpcUrl: string;
  multisigPda: string;
  transactionIndex: number;
  proposalStatus: string;
};

const ExecuteButton = ({
  rpcUrl,
  multisigPda,
  transactionIndex,
  proposalStatus,
}: ExecuteButtonProps) => {
  const wallet = useWallet();
  const walletModal = useWalletModal();
  const router = useRouter();

  const isTransactionReady = proposalStatus === "Approved";
  const connection = new Connection(rpcUrl, { commitment: "confirmed" });

  const executeTransaction = async () => {
    if (!wallet.publicKey) {
      walletModal.setVisible(true);
      return;
    }
    let bigIntTransactionIndex = BigInt(transactionIndex);

    if (!isTransactionReady) {
      toast.error("Proposal has not reached threshold.");
      return;
    }
    const executeTransaction =
      await multisig.transactions.vaultTransactionExecute({
        multisigPda: new PublicKey(multisigPda),
        connection,
        member: wallet.publicKey,
        transactionIndex: bigIntTransactionIndex,
        blockhash: (await connection.getLatestBlockhash()).blockhash,
        feePayer: wallet.publicKey,
      });

    const signature = await wallet.sendTransaction(
      executeTransaction,
      connection,
      {
        skipPreflight: true,
      }
    );
    console.log("Transaction signature", signature);
    toast.success("Transaction submitted.");
    await connection.confirmTransaction(signature, "confirmed");
    toast.success("Transaction executed.");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.refresh();
  };
  return (
    <Button
      disabled={!isTransactionReady}
      onClick={executeTransaction}
      className="mr-2"
    >
      Execute
    </Button>
  );
};

export default ExecuteButton;
