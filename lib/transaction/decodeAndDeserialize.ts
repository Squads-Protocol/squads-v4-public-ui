import * as bs58 from "bs58";
import { VersionedMessage } from "@solana/web3.js";

export function decodeAndDeserialize(tx: string): {
  message: VersionedMessage;
  version: number | "legacy";
} {
  try {
    const messageBytes = bs58.default.decode(tx);
    const version = VersionedMessage.deserializeMessageVersion(messageBytes);
    const message = VersionedMessage.deserialize(messageBytes);

    return { version, message };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to decode transaction.");
  }
}
