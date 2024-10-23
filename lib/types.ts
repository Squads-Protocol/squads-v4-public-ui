import { AccountInfo, ParsedAccountData, PublicKey } from "@solana/web3.js";
import * as multisig from "@sqds/multisig";

export interface MultisigInfo {
  publicKey: string;
  vault: string;
  balance: TotalBalancesReturn;
  data: multisig.generated.Multisig;
}

export interface CachedMultisigInfo {
  publicKey: string;
  vault: string;
  data: multisig.generated.Multisig;
}

export interface CachedData {
  multisigs: CachedMultisigInfo[];
  ttl: number;
}

// Mimic the v4 member type, since the SDK exposed type
// will error sometimes in the IDE
export interface Member {
  key: PublicKey;
  permissions: multisig.generated.Permissions;
}

export interface FilteredToken {
  mint: string;
  symbol: string | null;
  icon: string | null;
  pubkey: PublicKey;
  account: AccountInfo<ParsedAccountData>;
}

export interface FormValues {
  [key: string]: any;
}

export type ValidationErrors = Record<string, string>;
export type ValidationFunction = (value: any) => Promise<string | null>;
export interface ValidationRules {
  [key: string]: ValidationFunction;
}

export interface FormState {
  values: FormValues;
  errors: ValidationErrors;
  isValid: boolean;
  isLoading: boolean;
}

export interface TokenPrice {
  balance: number;
  usdAmount: number | null;
}

export interface TotalBalancesReturn {
  total: number;
  solana: TokenPrice;
  usdc: TokenPrice;
}
