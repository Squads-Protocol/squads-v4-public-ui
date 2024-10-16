"use client";
import {
  Connection,
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { Button } from "./ui/primitives/button";
import * as multisig from "@sqds/multisig";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type RemoveMemberButtonProps = {
  rpcUrl: string;
  multisigPda: string;
  transactionIndex: number;
  memberKey: string;
  programId: string;
};

const RemoveMemberButton = ({
  rpcUrl,
  multisigPda,
  transactionIndex,
  memberKey,
  programId,
}: RemoveMemberButtonProps) => {
  const wallet = useWallet();
  const walletModal = useWalletModal();
  const router = useRouter();

  const member = new PublicKey(memberKey);

  const connection = new Connection(rpcUrl, { commitment: "confirmed" });

  const removeMember = async () => {
    if (!wallet.publicKey) {
      walletModal.setVisible(true);
      return;
    }
    let bigIntTransactionIndex = BigInt(transactionIndex);

    const removeMemberIx = multisig.instructions.configTransactionCreate({
      multisigPda: new PublicKey(multisigPda),
      actions: [
        {
          __kind: "RemoveMember",
          oldMember: member,
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
      instructions: [removeMemberIx, proposalIx, approveIx],
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
    await connection.confirmTransaction(signature, "confirmed");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.refresh();
  };
  return (
    <Button
      disabled={false}
      onClick={() =>
        toast.promise(removeMember, {
          id: "transaction",
          loading: "Submitting...",
          success: "Remove Member action proposed.",
          error: (e) => `Failed to propose: ${e}`,
        })
      }
      className="font-neue bg-gradient-to-br from-stone-600 to-stone-800 text-white dark:bg-gradient-to-br dark:from-white dark:to-stone-400 dark:text-stone-700 hover:bg-gradient-to-br hover:from-stone-600 hover:to-stone-700 disabled:text-stone-500 disabled:bg-gradient-to-br disabled:from-stone-800 disabled:to-stone-900 dark:disabled:bg-gradient-to-br dark:disabled:from-stone-300 dark:disabled:to-stone-500 dark:disabled:text-stone-600 dark:hover:bg-stone-100 transition duration-200"
    >
      Remove
    </Button>
  );
};

export default RemoveMemberButton;
