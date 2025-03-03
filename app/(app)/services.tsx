"use client"

import * as multisig from '@sqds/multisig';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { useSuspenseQuery} from '@tanstack/react-query';
import { useCookie } from '@/app/(app)/cookies';
import { useMemo } from 'react';
// load multisig
export const useMultisig = (connection: Connection, multisigAddress: String) => {
  return useSuspenseQuery({
    queryKey: ['multisig', multisigAddress],
    queryFn: async () => {
      try {
        const multisigPubkey = new PublicKey(multisigAddress);

        return multisig.accounts.Multisig.fromAccountAddress(
          connection,
          multisigPubkey
        );
      }
      catch (error) {
        console.log(error);
        return null;
      }
    }
  })
};

export const useBalance = (connection: Connection, vaultAddress: String) => {
  return useSuspenseQuery({
    queryKey: ['balance', vaultAddress],
    queryFn: async () => {
      try {
        const multisigPubkey = new PublicKey(vaultAddress);
        return connection.getBalance(multisigPubkey);
      }
      catch (error) {
        console.log(error);
        return null;
      }
    }
  })
};

export const useGetTokens = (connection: Connection, address: String)=> {
  return useSuspenseQuery({
    queryKey: ['tokenBalances', address],
    queryFn: async () => {
      try {
        const addressPubkey = new PublicKey(address);
        return connection.getParsedTokenAccountsByOwner(
          addressPubkey,
          {
            programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
          }
        );
      }catch(error){
        console.log(error);
        return null;
      }
    }
  })
}

// Transactions
async function fetchTransactionData(
  connection: Connection,
  multisigPda: PublicKey,
  index: bigint,
  programId: PublicKey
) {
  const transactionPda = multisig.getTransactionPda({
    multisigPda,
    index,
    programId,
  });
  const proposalPda = multisig.getProposalPda({
    multisigPda,
    transactionIndex: index,
    programId,
  });

  let proposal;
  try {
    proposal = await multisig.accounts.Proposal.fromAccountAddress(
      connection,
      proposalPda[0]
    );
  } catch (error) {
    proposal = null;
  }

  return { transactionPda, proposal, index };
}

export const useTransactions = (connection: Connection, startIndex: number, endIndex: number, multisigAddress: string, programAddress: string) => {
  return useSuspenseQuery({
    queryKey: ['transactions', startIndex, endIndex, multisigAddress, programAddress],
    queryFn: async () => {
      try {
        const multisigPda = new PublicKey(multisigAddress);
        const programId = new PublicKey(programAddress);
        return Promise.all(
          Array.from({ length: startIndex - endIndex + 1 }, (_, i) => {
            const index = BigInt(startIndex - i);
            return fetchTransactionData(connection, multisigPda, index, programId);
          })
        );
      } catch(error) {
        console.error(error);
        return null;
      }
    }
  })
}

export const useMultisigData  = () => {
  const rpcUrl = useCookie("x-rpc-url") || clusterApiUrl("mainnet-beta");
  const connection = useMemo(() => new Connection(rpcUrl), [rpcUrl]);

  const multisigAddress = useCookie("x-multisig");
  const vaultIndex = Number(useCookie("x-vault-index")) || 0;

  const programIdCookie = useCookie("x-program-id");
  const programId = useMemo(
    () => (programIdCookie ? new PublicKey(programIdCookie) : multisig.PROGRAM_ID),
    [programIdCookie]
  );

  const multisigVault = useMemo(
    () => {
      if (multisigAddress) {
        return multisig.getVaultPda({
          multisigPda: new PublicKey(multisigAddress),
          index: vaultIndex,
          programId,
        })[0];
      }else{
        return null;
      }
    },
    [multisigAddress, vaultIndex, programId]
  );

  return { rpcUrl, connection, multisigAddress, vaultIndex, programId, multisigVault };
}