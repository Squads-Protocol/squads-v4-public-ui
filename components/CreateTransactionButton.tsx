"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as bs58 from "bs58";
import { Button } from "./ui/button";
import { useState } from "react";
import * as multisig from "@sqds/multisig";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Connection,
  PublicKey,
  TransactionInstruction,
  TransactionMessage,
  clusterApiUrl,
} from "@solana/web3.js";
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

  const getSampleMessage = async () => {
    let memo = "Hello from Solana land!";
    const vaultAddress = multisig.getVaultPda({
      index: vaultIndex,
      multisigPda: new PublicKey(multisigPda),
      programId: programId ? new PublicKey(programId) : multisig.PROGRAM_ID,
    })[0];
    const dummyMessage = new TransactionMessage({
      instructions: [
        new TransactionInstruction({
          keys: [
            {
              pubkey: wallet.publicKey as PublicKey,
              isSigner: true,
              isWritable: true,
            },
          ],
          data: Buffer.from(memo, "utf-8"),
          programId: new PublicKey(
            "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
          ),
        }),
      ],
      payerKey: vaultAddress,
      recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
    }).compileToV0Message();

    const encoded = bs58.default.encode(dummyMessage.serialize());

    setTx(encoded);
  };

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
          defaultValue={tx}
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
        <button
          onClick={() => getSampleMessage()}
          className="flex justify-end text-xs underline text-stone-400 hover:text-stone-200 cursor-pointer"
        >
          Click to use a sample memo for testing
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTransaction;
