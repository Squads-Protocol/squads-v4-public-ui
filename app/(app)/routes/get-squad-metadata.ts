"use server";

import { Connection, PublicKey } from "@solana/web3.js";
import { cookies } from "next/headers";

export async function getSquadMetadata() {
  const rpc = cookies().get("x-rpc-url")?.value;
  const squadAddress = cookies().get("x-multisig")?.value;

  if (!rpc) {
    return null;
  }
  if (!squadAddress) {
    return null;
  }

  return getSquadMetadataINTERNAL(rpc, squadAddress);
}

async function getSquadMetadataINTERNAL(rpc: string, squadAddress: string) {
  if (!rpc) {
    throw new Error("No RPC URL found");
  }

  try {
    const key = new PublicKey(squadAddress);
    const connection = new Connection(rpc);

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
}
