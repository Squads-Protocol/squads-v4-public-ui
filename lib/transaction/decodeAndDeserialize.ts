import * as bs58 from "bs58";
import { Message, TransactionMessage, VersionedMessage } from "@solana/web3.js";

export function decodeAndDeserialize(tx: string): {
  message: VersionedMessage;
  version: number | "legacy";
} {
  try {
    const messageBytes = bs58.default.decode(tx);
    const version = VersionedMessage.deserializeMessageVersion(messageBytes);

    let message;
    if (version === "legacy") {
      let legMsg = Message.from(messageBytes);
      let converted = TransactionMessage.decompile(legMsg).compileToV0Message();
      message = VersionedMessage.deserialize(converted.serialize());
    } else {
      message = VersionedMessage.deserialize(messageBytes);
    }

    return { version, message };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to decode transaction.");
  }
}
