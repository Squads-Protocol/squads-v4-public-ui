"use client";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Button } from "./ui/button";
import { useWallet } from "@solana/wallet-adapter-react";

const ConnectWallet = () => {
  const modal = useWalletModal();
  const { publicKey, disconnect } = useWallet();
  return (
    <div>
      {!publicKey ? (
        <Button onClick={() => modal.setVisible(true)}>Connect</Button>
      ) : (
        <Button onClick={disconnect}>Disconnect</Button>
      )}
    </div>
  );
};

export default ConnectWallet;
