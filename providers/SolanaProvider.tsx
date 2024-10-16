"use client";
import React, { FC, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { headers } from "next/headers";

require("@solana/wallet-adapter-react-ui/styles.css");

type SolanaProviderProps = {
  rpc: string | null;
  children?: React.ReactNode;
};

export const SolanaProvider: FC<SolanaProviderProps> = ({ rpc, children }) => {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(
    () => rpc || clusterApiUrl(network),
    [rpc || network]
  );
  const wallets = useMemo(() => [], [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
