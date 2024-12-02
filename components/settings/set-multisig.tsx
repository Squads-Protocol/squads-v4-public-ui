"use client";
import * as multisigSdk from "@sqds/multisig";
import { Connection, PublicKey } from "@solana/web3.js";
import { useRouter } from "next/navigation";
import { useState, FC } from "react";
import { toast } from "sonner";

const MultisigInput: FC<{ rpc: string | null, current: string | null, cluster?: string }> = ({ rpc, current, cluster }) => {
  const [multisig, setMultisig] = useState("");
  const router = useRouter();

  const setMultisigCookie = async () => {
    try {
      if (!rpc) {
        return toast.error("No RPC URL found.");
      }

      if (cluster && !cluster.includes("solana")) {
        document.cookie = `x-multisig=${multisig}; path=/`;
        router.push("/");
      }

      const connection = new Connection(rpc);

      const acct = await multisigSdk.accounts.Multisig.fromAccountAddress(
        connection,
        new PublicKey(multisig)
      );
      if (acct) {
        document.cookie = `x-multisig=${multisig}; path=/`;
        router.push("/");
      } else {
        throw new Error("Multisig is invalid for the current cluster.");
      }
    } catch (err) {
      toast.error("Provided account is not valid. Please try again.");
    }
  };

  return (
    <form action={async () => {
      await setMultisigCookie();
    }} className="mx-auto mt-10 flex max-w-xl gap-x-4">
      <label htmlFor="multisig-address" className="sr-only">
        Multisig address
      </label>
      <input
        id="multisig-address"
        name="multisig-address"
        type="text"
        required
        placeholder="Multisig address..."
        onChange={(e) => setMultisig(e.target.value)}
        className="min-w-0 flex-auto rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-neutral-400 focus:outline-2 focus:-outline-offset-2 focus:outline-white sm:text-sm/6"
      />
      <button
        type="submit"
        className="flex-none rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-neutral-700 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        Submit
      </button>
    </form>
  );
};

export default MultisigInput;
