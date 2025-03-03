'use client';
import {
  AddressLookupTableAccount,
  ComputeBudgetProgram,
  Connection,
  PublicKey,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
  clusterApiUrl,
} from '@solana/web3.js';
import { Button } from './ui/button';
import * as multisig from '@sqds/multisig';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Dialog, DialogDescription, DialogHeader } from './ui/dialog';
import { DialogTrigger } from './ui/dialog';
import { DialogContent, DialogTitle } from './ui/dialog';
import { useState } from 'react';
import { Input } from './ui/input';
import { range } from '@/lib/utils';
import { useMultisigData } from '@/hooks/useMultisigData';
import { useQueryClient } from '@tanstack/react-query';

type WithALT = {
  instruction: TransactionInstruction;
  lookupTableAccounts: AddressLookupTableAccount[];
};

type ExecuteButtonProps = {
  multisigPda: string;
  transactionIndex: number;
  proposalStatus: string;
  programId: string;
};

const ExecuteButton = ({
  multisigPda,
  transactionIndex,
  proposalStatus,
  programId,
}: ExecuteButtonProps) => {
  const wallet = useWallet();
  const walletModal = useWalletModal();
  const router = useRouter();
  const [priorityFeeLamports, setPriorityFeeLamports] = useState<number>(5000);
  const [computeUnitBudget, setComputeUnitBudget] = useState<number>(200_000);

  const isTransactionReady = proposalStatus === 'Approved';

  const { connection } = useMultisigData();
  const queryClient = useQueryClient();

  const executeTransaction = async () => {
    if (!wallet.publicKey) {
      walletModal.setVisible(true);
      return;
    }
    const member = wallet.publicKey;
    if (!wallet.signAllTransactions) return;
    let bigIntTransactionIndex = BigInt(transactionIndex);

    if (!isTransactionReady) {
      toast.error('Proposal has not reached threshold.');
      return;
    }

    console.log({
      multisigPda: multisigPda,
      connection,
      member: member.toBase58(),
      transactionIndex: bigIntTransactionIndex,
      programId: programId ? programId : multisig.PROGRAM_ID.toBase58(),
    });

    const [transactionPda] = multisig.getTransactionPda({
      multisigPda: new PublicKey(multisigPda),
      index: bigIntTransactionIndex,
      programId: programId ? new PublicKey(programId) : multisig.PROGRAM_ID,
    });

    let txData;
    let txType;
    try {
      await multisig.accounts.VaultTransaction.fromAccountAddress(connection, transactionPda);
      txType = 'vault';
    } catch (error) {
      try {
        await multisig.accounts.ConfigTransaction.fromAccountAddress(connection, transactionPda);
        txType = 'config';
      } catch (e) {
        txData = await multisig.accounts.Batch.fromAccountAddress(connection, transactionPda);
        txType = 'batch';
      }
    }

    let transactions: VersionedTransaction[] = [];

    const priorityFeeInstruction = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: priorityFeeLamports,
    });
    const computeUnitInstruction = ComputeBudgetProgram.setComputeUnitLimit({
      units: computeUnitBudget,
    });

    let blockhash = (await connection.getLatestBlockhash()).blockhash;

    if (txType == 'vault') {
      const resp = await multisig.instructions.vaultTransactionExecute({
        multisigPda: new PublicKey(multisigPda),
        connection,
        member,
        transactionIndex: bigIntTransactionIndex,
        programId: programId ? new PublicKey(programId) : multisig.PROGRAM_ID,
      });
      transactions.push(
        new VersionedTransaction(
          new TransactionMessage({
            instructions: [priorityFeeInstruction, computeUnitInstruction, resp.instruction],
            payerKey: member,
            recentBlockhash: blockhash,
          }).compileToV0Message(resp.lookupTableAccounts)
        )
      );
    } else if (txType == 'config') {
      const executeIx = multisig.instructions.configTransactionExecute({
        multisigPda: new PublicKey(multisigPda),
        member,
        rentPayer: member,
        transactionIndex: bigIntTransactionIndex,
        programId: programId ? new PublicKey(programId) : multisig.PROGRAM_ID,
      });
      transactions.push(
        new VersionedTransaction(
          new TransactionMessage({
            instructions: [priorityFeeInstruction, computeUnitInstruction, executeIx],
            payerKey: member,
            recentBlockhash: blockhash,
          }).compileToV0Message()
        )
      );
    } else if (txType == 'batch' && txData) {
      const executedBatchIndex = txData.executedTransactionIndex;
      const batchSize = txData.size;

      if (executedBatchIndex === undefined || batchSize === undefined) {
        throw new Error(
          "executedBatchIndex or batchSize is undefined and can't execute the transaction"
        );
      }

      transactions.push(
        ...(await Promise.all(
          range(executedBatchIndex + 1, batchSize).map(async (batchIndex) => {
            const { instruction: transactionExecuteIx, lookupTableAccounts } =
              await multisig.instructions.batchExecuteTransaction({
                connection,
                member,
                batchIndex: bigIntTransactionIndex,
                transactionIndex: batchIndex,
                multisigPda: new PublicKey(multisigPda),
                programId: programId ? new PublicKey(programId) : multisig.PROGRAM_ID,
              });

            const message = new TransactionMessage({
              payerKey: member,
              recentBlockhash: blockhash,
              instructions: [priorityFeeInstruction, computeUnitInstruction, transactionExecuteIx],
            }).compileToV0Message(lookupTableAccounts);

            return new VersionedTransaction(message);
          })
        ))
      );
    }

    const signedTransactions = await wallet.signAllTransactions(transactions);

    for (const signedTx of signedTransactions) {
      const signature = await connection.sendRawTransaction(signedTx.serialize(), {
        skipPreflight: true,
      });
      console.log('Transaction signature', signature);
      toast.loading('Confirming...', {
        id: 'transaction',
      });
      await connection.getSignatureStatuses([signature]);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    await queryClient.invalidateQueries({ queryKey: ['transactions'] });
  };
  return (
    <Dialog>
      <DialogTrigger
        disabled={!isTransactionReady}
        className={`mr-2 h-10 px-4 py-2 ${!isTransactionReady ? `bg-primary/50` : `bg-primary hover:bg-primary/90 `} text-primary-foreground  rounded-md`}
      >
        Execute
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Execute Transaction</DialogTitle>
          <DialogDescription>
            Select custom priority fees and compute unit limits and execute transaction.
          </DialogDescription>
        </DialogHeader>
        <h3>Priority Fee in lamports</h3>
        <Input
          placeholder="Priority Fee"
          onChange={(e) => setPriorityFeeLamports(Number(e.target.value))}
          value={priorityFeeLamports}
        />

        <h3>Compute Unit Budget</h3>
        <Input
          placeholder="Priority Fee"
          onChange={(e) => setComputeUnitBudget(Number(e.target.value))}
          value={computeUnitBudget}
        />
        <Button
          disabled={!isTransactionReady}
          onClick={() =>
            toast.promise(executeTransaction, {
              id: 'transaction',
              loading: 'Loading...',
              success: 'Transaction executed.',
              error: 'Failed to execute. Check console for info.',
            })
          }
          className="mr-2"
        >
          Execute
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ExecuteButton;
