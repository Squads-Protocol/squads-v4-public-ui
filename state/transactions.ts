"use client";
import { useQuery } from "@tanstack/react-query";
import { getRecentTransactions } from "@/lib/helpers/getRecentTransactions";
import { Connection, PublicKey } from "@solana/web3.js";

export const useTransactions = (
  ms: string,
  connection: Connection,
  transactionIndex: number,
  page: number,
  programId: string,
) => {
  const {
    data: transactions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["transactions", ms, page],
    queryFn: async () => {
      return await getRecentTransactions(
        connection!,
        new PublicKey(ms),
        transactionIndex,
        page,
        programId,
      );
    },
    enabled: !!connection && !!ms && !!transactionIndex && !!page,
    retry: 3,
  });

  return { transactions, isLoading, isError };
};
