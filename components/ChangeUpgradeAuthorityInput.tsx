"use client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/primitives/button";
import { Input } from "./ui/primitives/input";
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
  VersionedTransaction,
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

  const changeUpgradeAuth = async () => {
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

    const multisigTransactionIx = multisig.instructions.vaultTransactionCreate({
      multisigPda: new PublicKey(multisigPda),
      creator: wallet.publicKey,
      ephemeralSigners: 0,
      transactionMessage,
      transactionIndex: transactionIndexBN,
      addressLookupTableAccounts: [],
      rentPayer: wallet.publicKey,
      vaultIndex: vaultIndex,
      programId: globalProgramId
        ? new PublicKey(globalProgramId)
        : multisig.PROGRAM_ID,
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
      instructions: [multisigTransactionIx, proposalIx, approveIx],
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
        onClick={() =>
          toast.promise(changeUpgradeAuth, {
            id: "transaction",
            loading: "Loading...",
            success: "Upgrade authority change proposed.",
            error: (e) => `Failed to propose: ${e}`,
          })
        }
        disabled={!isPublickey(programId) || !isPublickey(newAuthority)}
        className="font-neue bg-gradient-to-br from-stone-600 to-stone-800 text-white dark:bg-gradient-to-br dark:from-white dark:to-stone-400 dark:text-stone-700 hover:bg-gradient-to-br hover:from-stone-600 hover:to-stone-700 disabled:text-stone-500 disabled:bg-gradient-to-br disabled:from-stone-800 disabled:to-stone-900 dark:disabled:bg-gradient-to-br dark:disabled:from-stone-300 dark:disabled:to-stone-500 dark:disabled:text-stone-700/50 dark:hover:bg-stone-100 transition duration-200"
      >
        Change Authority
      </Button>
    </div>
  );
};

export default ChangeUpgradeAuthorityInput;
