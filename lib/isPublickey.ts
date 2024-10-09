"use client";
import { PublicKey } from "@solana/web3.js";

export function isPublickey(key: string) {
  try {
    const pk = new PublicKey(key);
    if (pk) {
      return true;
    } else {
      console.log("Invalid public key");
      return false;
    }
  } catch (err) {
    return false;
  }
}
