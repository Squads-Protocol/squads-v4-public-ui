'use client';
import { Connection, PublicKey, Transaction, clusterApiUrl } from '@solana/web3.js';
import { Button } from './ui/button';
import * as multisig from '@sqds/multisig';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useMultisigData } from '@/hooks/useMultisigData';
import { useQueryClient } from '@tanstack/react-query';

type ApproveButtonProps = {
  multisigPda: string;
  transactionIndex: number;
  proposalStatus: string;
  programId: string;
};

const ApproveButton = ({
  multisigPda,
  transactionIndex,
  proposalStatus,
  programId,
}: ApproveButtonProps) => {
  const wallet = useWallet();
  const walletModal = useWalletModal();
  const validKinds = ['Rejected', 'Approved', 'Executing', 'Executed', 'Cancelled'];
  const isKindValid = validKinds.includes(proposalStatus || 'None');
  const { connection } = useMultisigData();
  const queryClient = useQueryClient();

  const approveProposal = async () => {
    if (!wallet.publicKey) {
      walletModal.setVisible(true);
      return;
    }
    let bigIntTransactionIndex = BigInt(transactionIndex);
    const transaction = new Transaction();
    if (proposalStatus === 'None') {
      const createProposalInstruction = multisig.instructions.proposalCreate({
        multisigPda: new PublicKey(multisigPda),
        creator: wallet.publicKey,
        isDraft: false,
        transactionIndex: bigIntTransactionIndex,
        rentPayer: wallet.publicKey,
        programId: programId ? new PublicKey(programId) : multisig.PROGRAM_ID,
      });
      transaction.add(createProposalInstruction);
    }
    if (proposalStatus == 'Draft') {
      const activateProposalInstruction = multisig.instructions.proposalActivate({
        multisigPda: new PublicKey(multisigPda),
        member: wallet.publicKey,
        transactionIndex: bigIntTransactionIndex,
        programId: programId ? new PublicKey(programId) : multisig.PROGRAM_ID,
      });
      transaction.add(activateProposalInstruction);
    }
    const approveProposalInstruction = multisig.instructions.proposalApprove({
      multisigPda: new PublicKey(multisigPda),
      member: wallet.publicKey,
      transactionIndex: bigIntTransactionIndex,
      programId: programId ? new PublicKey(programId) : multisig.PROGRAM_ID,
    });
    transaction.add(approveProposalInstruction);
    const signature = await wallet.sendTransaction(transaction, connection, {
      skipPreflight: true,
    });
    console.log('Transaction signature', signature);
    toast.loading('Confirming...', {
      id: 'transaction',
    });
    await connection.getSignatureStatuses([signature]);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await queryClient.invalidateQueries({ queryKey: ['transactions'] });
  };
  return (
    <Button
      disabled={isKindValid}
      onClick={() =>
        toast.promise(approveProposal, {
          id: 'transaction',
          loading: 'Loading...',
          success: 'Transaction approved.',
          error: (e) => `Failed to approve: ${e}`,
        })
      }
      className="mr-2"
    >
      Approve
    </Button>
  );
};

export default ApproveButton;
