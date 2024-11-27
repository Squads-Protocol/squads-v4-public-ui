"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "../ui/primitives/input";
import { Button } from "../ui/primitives/button";
import { isPublickey } from "@/lib/checks/isPublickey";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/primitives/card";
import { Computer } from "lucide-react";

export default function ProgramIdConfig() {
  return (
    <motion.div
      initial={{ opacity: 0.5, x: 25 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{
        delay: 0.1,
        duration: 0.4,
        ease: "easeInOut",
      }}
    >
      <Card className="font-neue dark:bg-darkforeground dark:border-darkborder/30">
        <CardHeader className="space-y-3">
          <CardTitle className="inline-flex gap-2 items-center tracking-wide">
            <Computer size={24} />
            Program ID
          </CardTitle>
          <CardDescription className="text-stone-500 dark:text-white/50">
            Set the Squads program ID to target.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SetProgramIdInput />
        </CardContent>
      </Card>
    </motion.div>
  );
}

const SetProgramIdInput = () => {
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
        placeholder="SQDS4ep65T869zMMBKyuUq6aD6EgTu8psMjkvj52pCf"
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
        className="mt-6"
      >
        Set Program ID
      </Button>
    </div>
  );
};
