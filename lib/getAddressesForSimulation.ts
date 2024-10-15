import {
  Connection,
  SystemProgram,
  Message,
  VersionedTransaction,
  AddressLookupTableAccount,
  VersionedMessage,
} from "@solana/web3.js";

export async function getAddressesForSimulation(
  connection: Connection,
  message: VersionedMessage,
  isLegacy: boolean
): Promise<string[]> {
  if (isLegacy) {
    return (message as Message)
      .nonProgramIds()
      .map((pubkey) => pubkey.toString())
      .filter((address) => address !== SystemProgram.programId.toBase58());
  } else {
    const addressLookupTableAccounts: AddressLookupTableAccount[] = [];
    const { addressTableLookups } = message;
    if (addressTableLookups.length > 0) {
      for (const addressTableLookup of addressTableLookups) {
        const { value } = await connection.getAddressLookupTable(
          addressTableLookup.accountKey
        );
        if (!value) continue;

        addressLookupTableAccounts.push(value);
      }
    }

    const { staticAccountKeys, accountKeysFromLookups } =
      message.getAccountKeys({ addressLookupTableAccounts });

    const staticAddresses = staticAccountKeys.map((k) => k.toString());

    const addressesFromLookups = accountKeysFromLookups
      ? accountKeysFromLookups.writable.map((k) => k.toString())
      : [];

    return [...new Set([...staticAddresses, ...addressesFromLookups])];
  }
}
