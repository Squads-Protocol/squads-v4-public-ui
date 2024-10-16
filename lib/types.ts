import { AccountInfo, ParsedAccountData, PublicKey } from "@solana/web3.js";
import * as multisig from "@sqds/multisig";

export interface MultisigInfo {
  publicKey: string;
  vault: string;
  balance: {
    total: number;
    solana: { balance: number; usdAmount: number };
    usdc: { balance: number; usdAmount: number };
  };
  data: multisig.generated.Multisig;
}

export interface CachedMultisigInfo {
  publicKey: string;
  vault: string;
  data: multisig.generated.Multisig;
  createdAt: number;
}

export interface CachedData {
  multisigs: CachedMultisigInfo[];
  ttl: number;
}

export interface FilteredTokens {
  mint: string;
  symbol: string | null;
  icon: string | null;
  pubkey: PublicKey;
  account: AccountInfo<ParsedAccountData>;
}
