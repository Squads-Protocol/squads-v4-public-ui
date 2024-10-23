"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "./ui/primitives/input";
import { Button } from "./ui/primitives/button";

const MultisigInput = () => {
  const [multisig, setMultisig] = useState("");
  const router = useRouter();

  const setMultisigCookie = () => {
    document.cookie = `x-multisig=${multisig}; path=/`;
    router.refresh();
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen w-full">
      <div className="w-1/4">
        <h1>Enter Multisig Address</h1>
        <p className="text-gray-500 text-sm">
          There is no multisig set for in Local Storage, set it by entering its
          Public Key in the Form below.
        </p>
        <Input
          type="text"
          placeholder="Multisig Address"
          className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 sm:text-sm mt-2"
          onChange={(e) => setMultisig(e.target.value)}
        />
        <Button onClick={setMultisigCookie} className="mt-4">
          Set Multisig
        </Button>
      </div>
    </div>
  );
};

export default MultisigInput;
