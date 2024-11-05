"use client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/primitives/button";
import { Input } from "../ui/primitives/input";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import * as multisig from "@sqds/multisig";
import {
  Connection,
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { toast } from "sonner";

type ChangeThresholdInputProps = {
  multisigPda: string;
  transactionIndex: number;
  rpcUrl: string;
  programId: string;
};

const ChangeThresholdInput = ({
  multisigPda,
  transactionIndex,
  rpcUrl,
  programId,
}: ChangeThresholdInputProps) => {
  const [threshold, setThreshold] = useState("");
  const wallet = useWallet();
  const walletModal = useWalletModal();
  const router = useRouter();

  const bigIntTransactionIndex = BigInt(transactionIndex);
  const connection = new Connection(rpcUrl, { commitment: "confirmed" });

  const changeThreshold = async () => {
    if (!wallet.publicKey) {
      walletModal.setVisible(true);
      return;
    }

    const changeThresholdIx = multisig.instructions.configTransactionCreate({
      multisigPda: new PublicKey(multisigPda),
      actions: [
        {
          __kind: "ChangeThreshold",
          newThreshold: parseInt(threshold),
        },
      ],
      creator: wallet.publicKey,
      transactionIndex: bigIntTransactionIndex,
      rentPayer: wallet.publicKey,
      programId: programId ? new PublicKey(programId) : multisig.PROGRAM_ID,
    });
    const proposalIx = multisig.instructions.proposalCreate({
      multisigPda: new PublicKey(multisigPda),
      creator: wallet.publicKey,
      isDraft: false,
      transactionIndex: bigIntTransactionIndex,
      rentPayer: wallet.publicKey,
      programId: programId ? new PublicKey(programId) : multisig.PROGRAM_ID,
    });
    const approveIx = multisig.instructions.proposalApprove({
      multisigPda: new PublicKey(multisigPda),
      member: wallet.publicKey,
      transactionIndex: bigIntTransactionIndex,
      programId: programId ? new PublicKey(programId) : multisig.PROGRAM_ID,
    });

    const message = new TransactionMessage({
      instructions: [changeThresholdIx, proposalIx, approveIx],
      payerKey: wallet.publicKey,
      recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
    }).compileToV0Message();

    const transaction = new VersionedTransaction(message);

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
    <div>
      <Input
        placeholder="Threshold Number"
        type="text"
        onChange={(e) => setThreshold(e.target.value)}
        className="mb-3"
      />
      <Button
        onClick={() =>
          toast.promise(changeThreshold, {
            id: "transaction",
            loading: "Loading...",
            success: "Threshold change proposed.",
            error: (e) => `Failed to propose: ${e}`,
          })
        }
        disabled={!threshold}
        className="font-neue bg-gradient-to-br from-stone-600 to-stone-800 text-white dark:bg-gradient-to-br dark:from-white dark:to-stone-400 dark:text-stone-700 hover:bg-gradient-to-br hover:from-stone-600 hover:to-stone-700 disabled:text-stone-500 disabled:bg-gradient-to-br disabled:from-stone-800 disabled:to-stone-900 dark:disabled:bg-gradient-to-br dark:disabled:from-stone-300 dark:disabled:to-stone-500 dark:disabled:text-stone-700/50 dark:hover:bg-stone-100 transition duration-200"
      >
        Change Threshold
      </Button>
    </div>
  );
};

export default ChangeThresholdInput;
