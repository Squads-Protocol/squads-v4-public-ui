"use client";
import {
  AddressLookupTableAccount,
  ComputeBudgetProgram,
  Connection,
  PublicKey,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
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

type WithALT = {
  instruction: TransactionInstruction;
  lookupTableAccounts: AddressLookupTableAccount[];
};

type ExecuteButtonProps = {
  rpcUrl: string;
  multisigPda: string;
  transactionIndex: number;
  proposalStatus: string;
  programId: string;
};

const ExecuteButton = ({
  rpcUrl,
  multisigPda,
  transactionIndex,
  proposalStatus,
  programId,
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

    console.log({
      multisigPda: multisigPda,
      connection,
      member: wallet.publicKey.toBase58(),
      transactionIndex: bigIntTransactionIndex,
      programId: programId ? programId : multisig.PROGRAM_ID.toBase58(),
    });

    const [transactionPda] = multisig.getTransactionPda({
      multisigPda: new PublicKey(multisigPda),
      index: bigIntTransactionIndex,
      programId: programId ? new PublicKey(programId) : multisig.PROGRAM_ID,
    });

    let txType;
    try {
      await multisig.accounts.VaultTransaction.fromAccountAddress(
        connection,
        transactionPda
      );
      txType = "vault";
    } catch (error) {
      txType = await multisig.accounts.ConfigTransaction.fromAccountAddress(
        connection,
        transactionPda
      );
      txType = "config";
    }
    console.log(txType);

    let executeInstruction;
    let altAccounts;
    if (txType == "vault") {
      const resp = await multisig.instructions.vaultTransactionExecute({
        multisigPda: new PublicKey(multisigPda),
        connection,
        member: wallet.publicKey,
        transactionIndex: bigIntTransactionIndex,
        programId: programId ? new PublicKey(programId) : multisig.PROGRAM_ID,
      });
      executeInstruction = resp.instruction;
      altAccounts = resp.lookupTableAccounts;
    } else if (txType == "config") {
      executeInstruction = multisig.instructions.configTransactionExecute({
        multisigPda: new PublicKey(multisigPda),
        member: wallet.publicKey,
        rentPayer: wallet.publicKey,
        transactionIndex: bigIntTransactionIndex,
        programId: programId ? new PublicKey(programId) : multisig.PROGRAM_ID,
      });
    } else {
      const resp = await multisig.instructions.vaultTransactionExecute({
        multisigPda: new PublicKey(multisigPda),
        connection,
        member: wallet.publicKey,
        transactionIndex: bigIntTransactionIndex,
        programId: programId ? new PublicKey(programId) : multisig.PROGRAM_ID,
      });
      executeInstruction = resp.instruction;
      altAccounts = resp.lookupTableAccounts;
    }

    const priorityFeeInstruction = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: priorityFeeLamports,
    });
    const computeUnitInstruction = ComputeBudgetProgram.setComputeUnitLimit({
      units: computeUnitBudget,
    });

    let blockhash = (await connection.getLatestBlockhash()).blockhash;

    const executeMessage = new TransactionMessage({
      instructions: [
        priorityFeeInstruction,
        computeUnitInstruction,
        executeInstruction,
      ],
      payerKey: wallet.publicKey,
      recentBlockhash: blockhash,
    }).compileToV0Message(altAccounts && altAccounts);

    const execTx = new VersionedTransaction(executeMessage);

    const signature = await wallet.sendTransaction(execTx, connection, {
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
    <Dialog>
      <DialogTrigger
        disabled={!isTransactionReady}
        className="mr-2 h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md"
      >
        Execute
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
          onClick={() =>
            toast.promise(executeTransaction, {
              id: "transaction",
              loading: "Loading...",
              success: "Transaction executed.",
              error: "Failed to execute. Check console for info.",
            })
          }
          className="mr-2"
        >
          Execute
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ExecuteButton;
