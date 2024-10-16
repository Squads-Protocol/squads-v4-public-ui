"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/primitives/dialog";
import { Button } from "./ui/primitives/button";
import { useState } from "react";
import * as multisig from "@sqds/multisig";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
  clusterApiUrl,
} from "@solana/web3.js";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Input } from "./ui/primitives/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { isPublickey } from "@/lib/isPublickey";

type SendSolProps = {
  rpcUrl: string;
  multisigPda: string;
  vaultIndex: number;
  programId?: string;
};

const SendSol = ({
  rpcUrl,
  multisigPda,
  vaultIndex,
  programId,
}: SendSolProps) => {
  const wallet = useWallet();
  const walletModal = useWalletModal();
  const [amount, setAmount] = useState(0);
  const [recipient, setRecipient] = useState("");
  const router = useRouter();

  const transfer = async () => {
    if (!wallet.publicKey) {
      walletModal.setVisible(true);
      return;
    }

    const vaultAddress = multisig.getVaultPda({
      index: vaultIndex,
      multisigPda: new PublicKey(multisigPda),
      programId: programId ? new PublicKey(programId) : multisig.PROGRAM_ID,
    })[0];

    const transferInstruction = SystemProgram.transfer({
      fromPubkey: vaultAddress,
      toPubkey: new PublicKey(recipient),
      lamports: amount * LAMPORTS_PER_SOL,
    });

    const connection = new Connection(rpcUrl || clusterApiUrl("mainnet-beta"), {
      commitment: "confirmed",
    });

    const multisigInfo = await multisig.accounts.Multisig.fromAccountAddress(
      connection,
      new PublicKey(multisigPda)
    );

    const blockhash = (await connection.getLatestBlockhash()).blockhash;

    const transferMessage = new TransactionMessage({
      instructions: [transferInstruction],
      payerKey: wallet.publicKey,
      recentBlockhash: blockhash,
    });

    const transactionIndex = Number(multisigInfo.transactionIndex) + 1;
    const transactionIndexBN = BigInt(transactionIndex);

    const multisigTransactionIx = multisig.instructions.vaultTransactionCreate({
      multisigPda: new PublicKey(multisigPda),
      creator: wallet.publicKey,
      ephemeralSigners: 0,
      transactionMessage: transferMessage,
      transactionIndex: transactionIndexBN,
      addressLookupTableAccounts: [],
      rentPayer: wallet.publicKey,
      vaultIndex: vaultIndex,
      programId: programId ? new PublicKey(programId) : multisig.PROGRAM_ID,
    });
    const proposalIx = multisig.instructions.proposalCreate({
      multisigPda: new PublicKey(multisigPda),
      creator: wallet.publicKey,
      isDraft: false,
      transactionIndex: transactionIndexBN,
      rentPayer: wallet.publicKey,
      programId: programId ? new PublicKey(programId) : multisig.PROGRAM_ID,
    });
    const approveIx = multisig.instructions.proposalApprove({
      multisigPda: new PublicKey(multisigPda),
      member: wallet.publicKey,
      transactionIndex: transactionIndexBN,
      programId: programId ? new PublicKey(programId) : multisig.PROGRAM_ID,
    });

    const message = new TransactionMessage({
      instructions: [multisigTransactionIx, proposalIx, approveIx],
      payerKey: wallet.publicKey,
      recentBlockhash: blockhash,
    }).compileToV0Message();

    const transaction = new VersionedTransaction(message);

    const signature = await wallet.sendTransaction(transaction, connection, {
      skipPreflight: true,
    });
    console.log("Transaction signature", signature);
    toast.loading("Confirming...", {
      id: "transaction",
    });
    await connection.confirmTransaction(signature, "confirmed");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.refresh();
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button>Send SOL</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer SOL</DialogTitle>
          <DialogDescription>
            Create a proposal to transfer SOL to another address.
          </DialogDescription>
        </DialogHeader>
        <Input
          placeholder="Recipient"
          type="text"
          onChange={(e) => setRecipient(e.target.value)}
        />
        {isPublickey(recipient) ? null : (
          <p className="text-xs">Invalid recipient address</p>
        )}
        <Input
          placeholder="Amount"
          type="number"
          onChange={(e) => setAmount(parseInt(e.target.value))}
        />
        <Button
          onClick={() =>
            toast.promise(transfer, {
              id: "transaction",
              loading: "Loading...",
              success: "Transfer proposed.",
              error: (e) => `Failed to propose: ${e}`,
            })
          }
          disabled={!isPublickey(recipient)}
        >
          Transfer
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SendSol;
