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
        <Button onClick={() => modal.setVisible(true)} className="w-full h-12">
          Connect Wallet
        </Button>
      ) : (
        <Button onClick={disconnect} className="w-full h-12">
          Disconnect Wallet
        </Button>
      )}
    </div>
  );
};

export default ConnectWallet;
