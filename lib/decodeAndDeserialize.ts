import * as bs58 from "bs58";
import { VersionedMessage, VersionedTransaction } from "@solana/web3.js";

export function decodeAndDeserialize(
  type: "base58" | "base64",
  tx: string
): VersionedMessage {
  try {
    if (type == "base58") {
      const messageBytes = bs58.default.decode(tx);
      console.log(messageBytes);
      return VersionedMessage.deserialize(messageBytes);
    } else {
      const messageBytes = Buffer.from(tx, "base64");
      return VersionedMessage.deserialize(messageBytes);
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to decode transaction.");
  }
}
