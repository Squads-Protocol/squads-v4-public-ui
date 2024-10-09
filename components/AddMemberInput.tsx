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
import { isPublickey } from "@/lib/isPublickey";

type AddMemberInputProps = {
  multisigPda: string;
  transactionIndex: number;
  rpcUrl: string;
  programId: string;
};

const AddMemberInput = ({
  multisigPda,
  transactionIndex,
  rpcUrl,
  programId,
}: AddMemberInputProps) => {
  const [member, setMember] = useState("");
  const wallet = useWallet();
  const walletModal = useWalletModal();
  const router = useRouter();

  const bigIntTransactionIndex = BigInt(transactionIndex);
  const connection = new Connection(rpcUrl, { commitment: "confirmed" });

  const addMember = async () => {
    if (!wallet.publicKey) {
      walletModal.setVisible(true);
      return;
    }

    const addMemberTransaction = multisig.transactions.configTransactionCreate({
      multisigPda: new PublicKey(multisigPda),
      actions: [
        {
          __kind: "AddMember",
          newMember: {
            key: new PublicKey(member),
            permissions: {
              mask: 7,
            },
          },
        },
      ],
      creator: wallet.publicKey,
      transactionIndex: bigIntTransactionIndex,
      rentPayer: wallet.publicKey,
      blockhash: (await connection.getLatestBlockhash()).blockhash,
      feePayer: wallet.publicKey,
      programId: programId ? new PublicKey(programId) : multisig.PROGRAM_ID,
    });

    const signature = await wallet.sendTransaction(
      addMemberTransaction,
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
        placeholder="Member Public Key"
        onChange={(e) => setMember(e.target.value)}
        className="mb-3"
      />
      <Button onClick={addMember} disabled={!isPublickey(member)}>
        Add Member
      </Button>
    </div>
  );
};

export default AddMemberInput;
