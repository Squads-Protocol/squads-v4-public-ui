"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/primitives/dialog";
import { Button } from "../ui/primitives/button";
import { useState } from "react";
import {
  createAssociatedTokenAccountIdempotentInstruction,
  createTransferCheckedInstruction,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import * as multisig from "@sqds/multisig";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Connection,
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
  clusterApiUrl,
} from "@solana/web3.js";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Input } from "../ui/primitives/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { isPublickey } from "@/lib/checks/isPublickey";
import SendInput from "../ui/primitives/send-input";

type SendTokensProps = {
  tokenAccount: string;
  mint: string;
  decimals: number;
  symbol: string;
  icon: string | null;
  rpcUrl: string;
  multisigPda: string;
  vaultIndex: number;
  programId?: string;
};

const SendTokens = ({
  tokenAccount,
  mint,
  decimals,
  symbol,
  icon,
  rpcUrl,
  multisigPda,
  vaultIndex,
  programId,
}: SendTokensProps) => {
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
    const recipientATA = getAssociatedTokenAddressSync(
      new PublicKey(mint),
      new PublicKey(recipient),
      true
    );

    const vaultAddress = multisig
      .getVaultPda({
        index: vaultIndex,
        multisigPda: new PublicKey(multisigPda),
        programId: programId ? new PublicKey(programId) : multisig.PROGRAM_ID,
      })[0]
      .toBase58();

    const createRecipientATAInstruction =
      createAssociatedTokenAccountIdempotentInstruction(
        new PublicKey(vaultAddress),
        recipientATA,
        new PublicKey(recipient),
        new PublicKey(mint)
      );

    const transferInstruction = createTransferCheckedInstruction(
      new PublicKey(tokenAccount),
      new PublicKey(mint),
      recipientATA,
      new PublicKey(vaultAddress),
      amount * 10 ** decimals,
      decimals
    );

    const connection = new Connection(rpcUrl || clusterApiUrl("mainnet-beta"), {
      commitment: "confirmed",
    });

    const multisigInfo = await multisig.accounts.Multisig.fromAccountAddress(
      connection,
      new PublicKey(multisigPda)
    );

    const blockhash = (await connection.getLatestBlockhash()).blockhash;

    const transferMessage = new TransactionMessage({
      instructions: [createRecipientATAInstruction, transferInstruction],
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
    await connection.getSignatureStatuses([signature]);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.refresh();
  };

  return (
    <Dialog>
      <DialogTrigger className="h-10 px-4 py-2 rounded-md font-neue bg-stone-700 text-white dark:bg-white dark:text-stone-700 disabled:text-stone-500 disabled:bg-gradient-to-br disabled:from-stone-800 disabled:to-stone-900 dark:disabled:bg-gradient-to-br dark:disabled:from-stone-300 dark:disabled:to-stone-500 dark:disabled:text-stone-700/50 dark:hover:bg-stone-100 transition duration-200">
        <p className="font-neue text-sm">Send {symbol ? symbol : "Tokens"}</p>
      </DialogTrigger>
      <DialogContent className="font-neue bg-darkforeground border border-[#A9A9A9]/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-neuemedium bg-gradient-to-br from-white to-stone-600 bg-clip-text leading-none text-transparent pointer-events-none">
            Transfer tokens
          </DialogTitle>
          <DialogDescription className="text-stone-400/75">
            Create a proposal to transfer tokens to another address.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 mb-6 flex flex-col space-y-6">
          <div className="flex flex-col space-y-1">
            <label className="text-sm text-white/75">Recipient</label>
            <Input
              placeholder="FcBpwMquaMURbYwpRFUr..."
              type="text"
              onChange={(e) => setRecipient(e.target.value)}
            />
            {isPublickey(recipient) ? null : (
              <p className="text-xs text-red-500">Invalid recipient address</p>
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-sm text-white/75">Amount</label>
            <SendInput
              amount={amount}
              setAmount={setAmount}
              label={symbol ? symbol : "Tokens"}
              icon={icon || undefined}
            />
            {amount > 0 ? null : (
              <p className="text-xs text-red-500">
                Amount must be greater than 0
              </p>
            )}
          </div>
        </div>
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
          className="font-neue bg-gradient-to-br from-stone-600 to-stone-800 text-white dark:bg-gradient-to-br dark:from-white dark:to-stone-400 dark:text-stone-700 hover:bg-gradient-to-br hover:from-stone-600 hover:to-stone-700 disabled:text-stone-500 disabled:bg-gradient-to-br disabled:from-stone-800 disabled:to-stone-900 dark:disabled:bg-gradient-to-br dark:disabled:from-stone-300 dark:disabled:to-stone-500 dark:disabled:text-stone-700/50 dark:hover:bg-stone-100 transition duration-200"
        >
          Transfer
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SendTokens;
