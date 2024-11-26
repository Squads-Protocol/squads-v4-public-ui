"use client";

import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { getClusterName } from "@arrangedev/detect-cluster";
import { Connection } from "@solana/web3.js";

type ClusterContextType = {
  connection: Connection | null;
  cluster: string | null;
  rpc: string | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
};

const initialContextState: ClusterContextType = {
  connection: null,
  cluster: null,
  rpc: null,
  isLoading: false,
  isError: false,
  error: null,
};

const ClusterContext = createContext(initialContextState);

export const useCluster = () => useContext(ClusterContext);

export const ClusterProvider = ({
  rpcUrl,
  children,
}: {
  rpcUrl: string | null;
  children: React.ReactNode;
}) => {
  const connection = new Connection(rpcUrl as string);

  const {
    data: clusterData,
    isError,
    isLoading,
    error: clusterError,
  } = useQuery({
    queryKey: ["clusterData", rpcUrl],
    queryFn: async () => {
      const cluster = await getClusterName(rpcUrl as string);
      return cluster;
    },
    enabled: !!rpcUrl,
  });

  return (
    <ClusterContext.Provider
      value={{
        connection: connection || null,
        cluster: clusterData || null,
        rpc: rpcUrl,
        isLoading,
        isError,
        error: clusterError,
      }}
    >
      {children}
    </ClusterContext.Provider>
  );
};
