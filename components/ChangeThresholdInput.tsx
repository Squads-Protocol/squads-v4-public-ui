"use client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import * as multisig from "@sqds/multisig";
import { Connection, PublicKey } from "@solana/web3.js";
import { toast } from "sonner";

type ChangeThresholdInputProps = {
  multisigPda: string;
  transactionIndex: number;
  rpcUrl: string;
};

const ChangeThresholdInput = ({
  multisigPda,
  transactionIndex,
  rpcUrl,
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

    const changeThresholdTransaction =
      multisig.transactions.configTransactionCreate({
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
        blockhash: (await connection.getLatestBlockhash()).blockhash,
        feePayer: wallet.publicKey,
      });

    const signature = await wallet.sendTransaction(
      changeThresholdTransaction,
      connection,
      {
        skipPreflight: true,
      }
    );
    console.log("Transaction signature", signature);
    toast.info("Transaction submitted.");
    await connection.confirmTransaction(signature, "confirmed");
    toast.success("Transaction created.");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.refresh();
  };
  return (
    <div>
      <Input
        placeholder="Thresold Number"
        type="text"
        onChange={(e) => setThreshold(e.target.value)}
        className="mb-3"
      />
      <Button onClick={changeThreshold} disabled={!threshold}>
        Change Threshold
      </Button>
    </div>
  );
};

export default ChangeThresholdInput;
