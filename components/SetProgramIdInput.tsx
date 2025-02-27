"use client";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { isPublickey } from "@/lib/isPublickey";
import { useCookie } from '@/app/(app)/cookies';

const SetProgramIdInput = () => {
  const foundProgramId = useCookie('x-program-id');

  const [programId, setProgramId] = useState("");
  const router = useRouter();

  const publicKeyTest = isPublickey(programId);

  const onSubmit = async () => {
    // Needs to use an RPC that isn't the public endpoint
    // const programTest = await isProgram(programId);
    if (publicKeyTest) {
      document.cookie = `x-program-id=${programId}`;
      setProgramId("");
      router.refresh();
    } else {
      throw "Please enter a valid program.";
    }
  };

  return (
    <div>
      <Input
        onChange={(e) => setProgramId(e.target.value)}
        placeholder={foundProgramId || "SQDS4ep65T869zMMBKyuUq6aD6EgTu8psMjkvj52pCf"}
        defaultValue={programId}
        className=""
      />
      {!publicKeyTest && programId.length > 0 && (
        <p className="text-xs mt-2 text-red-500">Please enter a valid key.</p>
      )}
      <Button
        onClick={() =>
          toast.promise(onSubmit(), {
            loading: "Loading...",
            success: "Program ID set successfully.",
            error: (err) => `${err}`,
          })
        }
        disabled={!publicKeyTest && programId.length > 0}
        className="mt-2"
      >
        Set Program ID
      </Button>
    </div>
  );
};

export default SetProgramIdInput;
