"use server";
import * as multisig from "@sqds/multisig";
import { Connection, PublicKey } from "@solana/web3.js";

const isMultisig = async (connection: Connection, address: string) => {
  try {
    let ad = new PublicKey(address);
    await multisig.accounts.Multisig.fromAccountAddress(connection, ad);
    return true;
  } catch (error) {
    return false;
  }
};

export const isMultisigAddress = async (
  connection: Connection,
  address: string
) => {
  const valid = await isMultisig(connection, address);
  return valid;
};
