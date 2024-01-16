"use client";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { Button } from "./ui/button";
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
};

const RemoveMemberButton = ({
  rpcUrl,
  multisigPda,
  transactionIndex,
  memberKey,
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

    const removeMemberTransaction =
      multisig.transactions.configTransactionCreate({
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
        blockhash: (await connection.getLatestBlockhash()).blockhash,
        feePayer: wallet.publicKey,
      });

    const signature = await wallet.sendTransaction(
      removeMemberTransaction,
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
    <Button disabled={false} onClick={removeMember}>
      Remove
    </Button>
  );
};

export default RemoveMemberButton;
