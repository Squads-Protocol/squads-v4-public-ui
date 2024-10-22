"use client";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

export async function isProgram(key: string, rpcUrl?: string) {
  const connection = new Connection(rpcUrl || clusterApiUrl("mainnet-beta"), {
    commitment: "confirmed",
  });
  try {
    const pk = new PublicKey(key);
    const info = await connection.getAccountInfo(pk);
    if (info == null) {
      return false;
    } else {
      if (info.executable) {
        return true;
      }

      return false;
    }
  } catch (err) {
    return false;
  }
}
