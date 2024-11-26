"use client";
import * as multisig from "@sqds/multisig";
import { useQuery } from "@tanstack/react-query";
import { useCluster } from "./ClusterContext";
import { Connection, PublicKey } from "@solana/web3.js";

interface UseSquadMetadataResponse {
  key: PublicKey;
  account: multisig.generated.Multisig | null;
  metadata: {
    name: string;
    description: string;
    imageUrl: string;
  };
  loading: boolean;
  isError: boolean;
}

export const useSquadMetadata = (ms: string): UseSquadMetadataResponse => {
  const { connection } = useCluster();
  const msAddress = new PublicKey(ms);

  const {
    data: squadMetadata,
    isLoading: squadLoading,
    isError: squadMetaError,
  } = useQuery({
    queryKey: ["squadAccount", ms],
    queryFn: async () => {
      return await multisig.accounts.Multisig.fromAccountAddress(
        connection!,
        msAddress
      );
    },
    enabled: !!connection,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const {
    data: vanity,
    isLoading: vanityLoading,
    isError: vanityError,
  } = useQuery({
    queryKey: ["squadMetadata", ms],
    queryFn: async () => {
      const response = await getSquadMetadata(connection!, ms);
      return response;
    },
    enabled: !!connection,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return {
    key: msAddress,
    account: squadMetadata ?? null,
    metadata: vanity,
    loading: squadLoading || vanityLoading,
    isError: squadMetaError || vanityError,
  };
};

const getSquadMetadata = async (
  connection: Connection,
  squadAddress: string
) => {
  if (!connection) {
    throw new Error("No RPC URL found");
  }

  try {
    const key = new PublicKey(squadAddress);

    const response = await connection.getSignaturesForAddress(key);

    if (!response) {
      return null;
    }

    const memo = response[0].memo;

    if (!memo) {
      return null;
    }

    let formatted = memo.replace(/^\[\d+\]\s*/, "");

    formatted = formatted.replace(/'/g, '"');

    return JSON.parse(formatted);
  } catch (e) {
    console.log(e);
    return null;
  }
};
