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
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  AddressLookupTableAccount,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  TransactionMessage,
  VersionedMessage,
  VersionedTransaction,
  clusterApiUrl,
} from "@solana/web3.js";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { isPublickey } from "@/lib/isPublickey";
import { decodeAndDeserialize } from "@/lib/decodeAndDeserialize";
import { getAddressesForSimulation } from "@/lib/getAddressesForSimulation";

type CreateTransactionProps = {
  multisigPda: string;
  vaultIndex: number;
  programId?: string;
};

const CreateTransaction = ({
  multisigPda,
  vaultIndex,
  programId,
}: CreateTransactionProps) => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const walletModal = useWalletModal();

  const [tx, setTx] = useState("");
  const [type, setType] = useState<"base58" | "base64">("base64");

  const [amount, setAmount] = useState(0);
  const [recipient, setRecipient] = useState("");
  const router = useRouter();

  const getDummyMessage = async () => {
    const vaultAddress = multisig.getVaultPda({
      index: vaultIndex,
      multisigPda: new PublicKey(multisigPda),
      programId: programId ? new PublicKey(programId) : multisig.PROGRAM_ID,
    })[0];
    const dummyMessage = new TransactionMessage({
      instructions: [
        SystemProgram.transfer({
          fromPubkey: vaultAddress,
          toPubkey: wallet.publicKey!,
          lamports: 100,
        }),
      ],
      payerKey: wallet.publicKey!,
      recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
    }).compileToV0Message();

    const encoded = bs58.default.encode(dummyMessage.serialize());

    console.log(encoded);

    return encoded;
  };

  const simulate = async () => {
    if (!wallet.publicKey) {
      walletModal.setVisible(true);
      return;
    }
    try {
      const decoded = decodeAndDeserialize(type, tx);

      const addressesForSimulation = await getAddressesForSimulation(
        connection,
        decoded,
        true
      );

      const transaction = new VersionedTransaction(decoded);

      toast.loading("Simulating...", {
        id: "transaction",
      });
      const { value } = await connection.simulateTransaction(transaction, {
        sigVerify: false,
        replaceRecentBlockhash: true,
        accounts: {
          encoding: "base64",
          addresses: addressesForSimulation,
        },
      });

      if (value.err) {
        throw new Error("Simulation failed");
      }
    } catch (error) {
      console.error(error);
      throw new Error("Simulation failed.");
    }
  };

  const transfer = async () => {
    if (!wallet.publicKey) {
      walletModal.setVisible(true);
      return;
    }
    try {
      const decoded = decodeAndDeserialize(type, tx);

      const altAccounts = await getAddressesForSimulation(
        connection,
        decoded,
        true
      );

      const addressLookupTableAccountInfos =
        await connection.getMultipleAccountsInfo(
          altAccounts.map((key) => new PublicKey(key))
        );

      const altAccountsForTransaction = addressLookupTableAccountInfos.reduce(
        (acc, accountInfo, index) => {
          const addressLookupTableAddress = altAccounts[index];
          if (accountInfo) {
            const addressLookupTableAccount = new AddressLookupTableAccount({
              key: new PublicKey(addressLookupTableAddress),
              state: AddressLookupTableAccount.deserialize(accountInfo.data),
            });
            acc.push(addressLookupTableAccount);
          }

          return acc;
        },
        new Array<AddressLookupTableAccount>()
      );

      const multisigInfo = await multisig.accounts.Multisig.fromAccountAddress(
        connection,
        new PublicKey(multisigPda)
      );

      const transactionMessage = TransactionMessage.decompile(decoded);

      const transactionIndex = Number(multisigInfo.transactionIndex) + 1;
      const transactionIndexBN = BigInt(transactionIndex);

      const multisigTransactionIx =
        multisig.instructions.vaultTransactionCreate({
          multisigPda: new PublicKey(multisigPda),
          creator: wallet.publicKey,
          ephemeralSigners: 0,
          transactionMessage: transactionMessage,
          transactionIndex: transactionIndexBN,
          addressLookupTableAccounts: altAccountsForTransaction,
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

      const blockhash = (await connection.getLatestBlockhash()).blockhash;

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
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button>Import Transaction</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Transaction</DialogTitle>
          <DialogDescription>
            Propose a transaction from a base58 or base64 encoded transaction
            message.
          </DialogDescription>
        </DialogHeader>
        <Input
          placeholder="Paste encoded transaction..."
          type="text"
          onChange={(e) => setTx(e.target.value)}
        />
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setType("base64")}
            className={`flex gap-3 items-center justify-start bg-[#E6E6E6] dark:bg-[#292524] border border-[#A9A9A9]/10 ${
              type == "base64" ? "bg-[#A9A9A9]" : "hover:bg-[#E6E6E6]/50"
            } py-1 px-2.5 rounded-full`}
          >
            <p className={`font-neue dark:text-white/75 text-xs`}>Base64</p>
          </button>
          <button
            onClick={() => setType("base58")}
            className={`flex gap-3 items-center justify-start bg-[#E6E6E6] dark:bg-[#292524] border border-[#A9A9A9]/10 ${
              type == "base58" ? "bg-[#A9A9A9]" : "hover:bg-[#E6E6E6]/50"
            } py-1 px-2.5 rounded-full`}
          >
            <p className={`font-neue dark:text-white/75 text-xs`}>Base58</p>
          </button>
        </div>
        <div className="flex gap-2 items-center justify-end">
          <Button
            onClick={() =>
              toast.promise(getDummyMessage, {
                id: "simulation",
                loading: "Building simulation...",
                success: "Simulation successful.",
                error: (e) => `${e}`,
              })
            }
          >
            Get Sample
          </Button>
          <Button
            onClick={() =>
              toast.promise(simulate, {
                id: "simulation",
                loading: "Building simulation...",
                success: "Simulation successful.",
                error: (e) => `${e}`,
              })
            }
          >
            Simulate
          </Button>
          <Button
            onClick={() =>
              toast.promise(transfer, {
                id: "transaction",
                loading: "Building transaction...",
                success: "Transaction proposed.",
                error: (e) => `Failed to propose: ${e}`,
              })
            }
          >
            Propose
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTransaction;
