import { NATIVE_MINT } from "@solana/spl-token";
import { USDC_MINT } from "../consts";

interface AddressEntry {
  key: string;
  icon: string;
}

type CommonAddresses = ReadonlyMap<string, AddressEntry>;

export function lookupAddress(address: string): AddressEntry | undefined {
  return ADDRESS_MAP.get(address);
}

export const ADDRESS_MAP: CommonAddresses = new Map([
  [
    NATIVE_MINT.toString(),
    {
      key: "SOL",
      icon: "/tokens/SOL.webp",
    },
  ],
  [
    "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    {
      key: "USDC",
      icon: "/tokens/USDC.webp",
    },
  ],
  [
    "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    {
      key: "USDT",
      icon: "/tokens/USDT.webp",
    },
  ],
  [
    "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn",
    {
      key: "jitoSOL",
      icon: "/tokens/jitoSOL.webp",
    },
  ],
  [
    "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
    {
      key: "mSOL",
      icon: "/tokens/mSOL.webp",
    },
  ],
  [
    "bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1",
    {
      key: "bSOL",
      icon: "/tokens/bSOL.webp",
    },
  ],
  [
    "he1iusmfkpAdwvxLNGV8Y1iSbj4rUy6yMhEA3fotn9A",
    {
      key: "hSOL",
      icon: "/tokens/hSOL.webp",
    },
  ],
  [
    "BonK1YhkXEGLZzwtcvRTip3gAL9nCeQD7ppZBLXhtTs",
    {
      key: "bonkSOL",
      icon: "/tokens/bonkSOL.webp",
    },
  ],
  [
    "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
    {
      key: "JUP",
      icon: "/tokens/JUP.webp",
    },
  ],
  [
    "27G8MtK7VtTcCHkpASjSDdkWWYfoqT6ggEuKidVJidD4",
    {
      key: "JLP",
      icon: "/tokens/JLP.webp",
    },
  ],
  [
    "CLoUDKc4Ane7HeQcPpE3YHnznRxhMimJ4MyaUqyHFzAu",
    {
      key: "CLOUD",
      icon: "/tokens/CLOUD.webp",
    },
  ],
  [
    "5oVNBeEEQvYi1cX3ir8Dx5n1P7pdxydbGF2X4TxVusJm",
    {
      key: "INF",
      icon: "/tokens/INF.webp",
    },
  ],
]);
