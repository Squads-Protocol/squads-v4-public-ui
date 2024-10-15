"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { simulateEncodedTransaction } from "@/lib/transaction/simulateEncodedTransaction";
import { importTransaction } from "@/lib/transaction/importTransaction";

type CreateTransactionProps = {
  rpcUrl: string | null;
  multisigPda: string;
  vaultIndex: number;
  programId?: string;
};

const CreateTransaction = ({
  rpcUrl,
  multisigPda,
  vaultIndex,
  programId,
}: CreateTransactionProps) => {
  const wallet = useWallet();

  const [tx, setTx] = useState("");
  const [open, setOpen] = useState(false);

  const connection = new Connection(rpcUrl || clusterApiUrl("mainnet-beta"), {
    commitment: "confirmed",
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button>Import Transaction</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Transaction</DialogTitle>
          <DialogDescription>
            Propose a transaction from a base58 encoded transaction message (not
            a transaction). Does not support v0 messages with lookup tables.
          </DialogDescription>
        </DialogHeader>
        <Input
          placeholder="Paste base58 encoded transaction..."
          type="text"
          onChange={(e) => setTx(e.target.value)}
        />
        <div className="flex gap-2 items-center justify-end">
          <Button
            onClick={() =>
              toast.promise(
                simulateEncodedTransaction(tx, connection, wallet),
                {
                  id: "simulation",
                  loading: "Building simulation...",
                  success: "Simulation successful.",
                  error: (e) => `${e}`,
                }
              )
            }
          >
            Simulate
          </Button>
          <Button
            onClick={() =>
              toast.promise(
                importTransaction(
                  tx,
                  connection,
                  multisigPda,
                  programId!,
                  vaultIndex,
                  wallet
                ),
                {
                  id: "transaction",
                  loading: "Building transaction...",
                  success: () => {
                    setOpen(false);
                    return "Transaction proposed.";
                  },
                  error: (e) => `Failed to propose: ${e}`,
                }
              )
            }
          >
            Import
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTransaction;
