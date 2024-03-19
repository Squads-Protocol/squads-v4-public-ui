"use client";
import {
  ComputeBudgetInstruction,
  ComputeBudgetProgram,
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
import { Dialog, DialogDescription, DialogHeader } from "./ui/dialog";
import { DialogTrigger } from "./ui/dialog";
import { DialogContent, DialogTitle } from "./ui/dialog";
import { useState } from "react";
import { Input } from "./ui/input";

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
  const [priorityFeeLamports, setPriorityFeeLamports] = useState<number>(5000);
  const [computeUnitBudget, setComputeUnitBudget] = useState<number>(200_000);

  const isTransactionReady = proposalStatus === "Approved";
  const connection = new Connection(rpcUrl || clusterApiUrl("mainnet-beta"), {
    commitment: "confirmed",
  });

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

    let executeTransaction = new Transaction();
    const executeInstruction =
      await multisig.instructions.vaultTransactionExecute({
        multisigPda: new PublicKey(multisigPda),
        connection,
        member: wallet.publicKey,
        transactionIndex: bigIntTransactionIndex,
      });

    const priorityFeeInstruction = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: priorityFeeLamports,
    });
    const computeUnitInstruction = ComputeBudgetProgram.setComputeUnitLimit({
      units: computeUnitBudget,
    });

    executeTransaction.add(
      computeUnitInstruction,
      priorityFeeInstruction,
      executeInstruction.instruction
    );

    executeTransaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;
    executeTransaction.feePayer = wallet.publicKey;

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
    <Dialog>
      <DialogTrigger disabled={!isTransactionReady}>
        <Button disabled={!isTransactionReady} className="mr-2">
          Execute
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Execute Transaction</DialogTitle>
          <DialogDescription>
            Select custom priority fees and compute unit limits and execute
            transaction.
          </DialogDescription>
        </DialogHeader>
        <h3>Priority Fee in lamports</h3>
        <Input
          placeholder="Priority Fee"
          onChange={(e) => setPriorityFeeLamports(Number(e.target.value))}
          value={priorityFeeLamports}
        />

        <h3>Compute Unit Budget</h3>
        <Input
          placeholder="Priority Fee"
          onChange={(e) => setComputeUnitBudget(Number(e.target.value))}
          value={computeUnitBudget}
        />
        <Button
          disabled={!isTransactionReady}
          onClick={executeTransaction}
          className="mr-2"
        >
          Execute
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ExecuteButton;
