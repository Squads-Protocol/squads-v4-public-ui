import {
  AddressLookupTableAccount,
  Connection,
  Message,
  SystemProgram,
  VersionedMessage,
  VersionedTransaction,
} from "@solana/web3.js";

export async function getAccountsForSimulation(
  connection: Connection,
  tx: VersionedTransaction,
  isLegacy: boolean
): Promise<string[]> {
  if (isLegacy) {
    return (tx.message as Message)
      .nonProgramIds()
      .map((pubkey) => pubkey.toString())
      .filter((address) => address !== SystemProgram.programId.toBase58());
  } else {
    const addressLookupTableAccounts = await loadLookupTables(
      connection,
      tx.message
    );

    const { staticAccountKeys, accountKeysFromLookups } =
      tx.message.getAccountKeys({ addressLookupTableAccounts });

    const staticAddresses = staticAccountKeys
      .filter((k) => !k.equals(SystemProgram.programId))
      .map((k) => k.toString());

    const addressesFromLookups = accountKeysFromLookups
      ? accountKeysFromLookups.writable.map((k) => k.toString())
      : [];

    return [...new Set([...staticAddresses, ...addressesFromLookups])];
  }
}

export async function loadLookupTables(
  connection: Connection,
  transactionMessage: VersionedMessage
) {
  const addressLookupTableAccounts: AddressLookupTableAccount[] = [];
  const { addressTableLookups } = transactionMessage;
  if (addressTableLookups.length > 0) {
    for (const addressTableLookup of addressTableLookups) {
      const { value } = await connection.getAddressLookupTable(
        addressTableLookup.accountKey
      );
      if (!value) continue;

      addressLookupTableAccounts.push(value);
    }
  }
  return addressLookupTableAccounts;
}
