import * as bs58 from "bs58";
import {
  Message,
  MessageAccountKeys,
  MessageV0,
  PublicKey,
  Transaction,
  TransactionMessage,
  VersionedMessage,
  VersionedTransaction,
} from "@solana/web3.js";

interface DeserializedTransaction {
  message: TransactionMessage;
  version: number | "legacy";
  accountKeys: PublicKey[];
}

/**
 * Decodes a base58 encoded transaction and deserializes it into a TransactionMessage
 * @param tx - Base58 encoded transaction string
 * @returns Object containing the deserialized message, version, and account keys
 * @throws Error if deserialization fails
 */
export function decodeAndDeserialize(tx: string): DeserializedTransaction {
  if (!tx) {
    throw new Error("Transaction string is required");
  }

  try {
    const messageBytes = bs58.default.decode(tx);
    const version = VersionedMessage.deserializeMessageVersion(messageBytes);
    let message: TransactionMessage;
    let accountKeys: PublicKey[];

    if (version === "legacy") {
      const legacyMessage = Message.from(messageBytes);
      accountKeys = legacyMessage.accountKeys;

      const intermediate = VersionedMessage.deserialize(
        new MessageV0(legacyMessage).serialize()
      );
      message = TransactionMessage.decompile(intermediate, {
        addressLookupTableAccounts: [],
      });
    } else {
      const versionedMessage = VersionedMessage.deserialize(messageBytes);
      accountKeys = versionedMessage.staticAccountKeys;

      message = TransactionMessage.decompile(versionedMessage, {
        addressLookupTableAccounts: [],
      });
    }

    return {
      version,
      message,
      accountKeys,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to decode transaction: ${error.message}`);
    }
    throw new Error("Failed to decode transaction: Unknown error");
  }
}
