import * as bs58 from "bs58";
import { VersionedMessage, VersionedTransaction } from "@solana/web3.js";

export function decodeAndDeserialize(tx: string): VersionedMessage {
  try {
    const messageBytes = bs58.default.decode(tx);
    return VersionedMessage.deserialize(messageBytes);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to decode transaction.");
  }
}
