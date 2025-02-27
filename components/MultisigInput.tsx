"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const MultisigInput = ({onUpdate}:{onUpdate: () => void}) => {
  const [multisig, setMultisig] = useState("");
  const router = useRouter();

  const setMultisigCookie = () => {
    console.log("setting cookie", multisig);
    document.cookie = `x-multisig=${multisig}; path=/`;
    onUpdate();
  };

  return (
    <div
      className="
    w-full max-w-4xl mx-auto
    px-4 sm:px-6 lg:px-8
    py-6 md:py-10
    space-y-4
    min-h-screen
  "
    >

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
)
  ;
};

export default MultisigInput;
