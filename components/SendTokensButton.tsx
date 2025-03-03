'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { useState } from 'react';
import {
  createAssociatedTokenAccountIdempotentInstruction,
  createTransferCheckedInstruction,
  getAssociatedTokenAddressSync,
} from '@solana/spl-token';
import * as multisig from '@sqds/multisig';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  Connection,
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
  clusterApiUrl,
} from '@solana/web3.js';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { isPublickey } from '@/lib/isPublickey';
import { useMultisigData } from '@/hooks/useMultisigData';

type SendTokensProps = {
  tokenAccount: string;
  mint: string;
  decimals: number;
  multisigPda: string;
  vaultIndex: number;
  programId?: string;
};

const SendTokens = ({
  tokenAccount,
  mint,
  decimals,
  multisigPda,
  vaultIndex,
  programId,
}: SendTokensProps) => {
  const wallet = useWallet();
  const walletModal = useWalletModal();
  const [amount, setAmount] = useState<string>('');
  const [recipient, setRecipient] = useState('');
  const router = useRouter();

  const { connection } = useMultisigData();

  const parsedAmount = parseFloat(amount);
  const isAmountValid = !isNaN(parsedAmount) && parsedAmount > 0;

  const transfer = async () => {
    if (!wallet.publicKey) {
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

    const createRecipientATAInstruction = createAssociatedTokenAccountIdempotentInstruction(
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
      parsedAmount * 10 ** decimals,
      decimals
    );

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
    console.log('Transaction signature', signature);
    toast.loading('Confirming...', {
      id: 'transaction',
    });
    await connection.getSignatureStatuses([signature]);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.refresh();
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button
          onClick={(e) => {
            if (!wallet.publicKey) {
              e.preventDefault();
              walletModal.setVisible(true);
              return;
            }
          }}
        >
          Send Tokens
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer tokens</DialogTitle>
          <DialogDescription>
            Create a proposal to transfer tokens to another address.
          </DialogDescription>
        </DialogHeader>
        <Input placeholder="Recipient" type="text" onChange={(e) => setRecipient(e.target.value)} />
        {isPublickey(recipient) ? null : <p className="text-xs">Invalid recipient address</p>}
        <Input placeholder="Amount" type="number" onChange={(e) => setAmount(e.target.value)} />
        {!isAmountValid && amount.length > 0 && (
          <p className="text-xs text-red-500">Invalid amount</p>
        )}
        <Button
          onClick={() =>
            toast.promise(transfer, {
              id: 'transaction',
              loading: 'Loading...',
              success: 'Transfer proposed.',
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

export default SendTokens;
