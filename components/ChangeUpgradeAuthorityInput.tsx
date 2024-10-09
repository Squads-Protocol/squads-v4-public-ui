"use client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import * as multisig from "@sqds/multisig";
import {
  AccountMeta,
  Connection,
  PublicKey,
  TransactionInstruction,
  TransactionMessage,
} from "@solana/web3.js";
import { toast } from "sonner";
import { isPublickey } from "@/lib/isPublickey";

type ChangeUpgradeAuthorityInputProps = {
  multisigPda: string;
  transactionIndex: number;
  rpcUrl: string;
  vaultIndex: number;
  globalProgramId: string;
};

const ChangeUpgradeAuthorityInput = ({
  multisigPda,
  transactionIndex,
  rpcUrl,
  vaultIndex,
  globalProgramId,
}: ChangeUpgradeAuthorityInputProps) => {
  const [programId, setProgramId] = useState("");
  const [newAuthority, setNewAuthority] = useState("");
  const wallet = useWallet();
  const walletModal = useWalletModal();
  const router = useRouter();

  const bigIntTransactionIndex = BigInt(transactionIndex);
  const connection = new Connection(rpcUrl, { commitment: "confirmed" });

  const vaultAddress = multisig.getVaultPda({
    index: vaultIndex,
    multisigPda: new PublicKey(multisigPda),
    programId: globalProgramId
      ? new PublicKey(globalProgramId)
      : multisig.PROGRAM_ID,
  })[0];

  const changeThreshold = async () => {
    if (!wallet.publicKey) {
      walletModal.setVisible(true);
      return;
    }

    const upgradeData = Buffer.alloc(4);
    upgradeData.writeInt32LE(4, 0);

    const [programDataAddress] = PublicKey.findProgramAddressSync(
      [new PublicKey(programId).toBuffer()],
      new PublicKey("BPFLoaderUpgradeab1e11111111111111111111111")
    );
    const keys: AccountMeta[] = [
      {
        pubkey: programDataAddress,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: vaultAddress,
        isWritable: false,
        isSigner: true,
      },
      {
        pubkey: new PublicKey(newAuthority),
        isWritable: false,
        isSigner: false,
      },
    ];

    const blockhash = (await connection.getLatestBlockhash()).blockhash;

    const transactionMessage = new TransactionMessage({
      instructions: [
        new TransactionInstruction({
          programId: new PublicKey(
            "BPFLoaderUpgradeab1e11111111111111111111111"
          ),
          data: upgradeData,
          keys,
        }),
      ],
      payerKey: wallet.publicKey,
      recentBlockhash: blockhash,
    });

    const transactionIndexBN = BigInt(transactionIndex);

    const multisigTransaction = multisig.transactions.vaultTransactionCreate({
      multisigPda: new PublicKey(multisigPda),
      blockhash,
      creator: wallet.publicKey,
      ephemeralSigners: 0,
      feePayer: wallet.publicKey,
      transactionMessage,
      transactionIndex: transactionIndexBN,
      addressLookupTableAccounts: [],
      rentPayer: wallet.publicKey,
      vaultIndex: vaultIndex,
      programId: globalProgramId
        ? new PublicKey(globalProgramId)
        : multisig.PROGRAM_ID,
    });

    const signature = await wallet.sendTransaction(
      multisigTransaction,
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
        placeholder="Program ID"
        type="text"
        onChange={(e) => setProgramId(e.target.value)}
        className="mb-3"
      />
      <Input
        placeholder="New Program Authority"
        type="text"
        onChange={(e) => setNewAuthority(e.target.value)}
        className="mb-3"
      />
      <Button
        onClick={changeThreshold}
        disabled={!isPublickey(programId) || !isPublickey(newAuthority)}
      >
        Change Authority
      </Button>
    </div>
  );
};

export default ChangeUpgradeAuthorityInput;
