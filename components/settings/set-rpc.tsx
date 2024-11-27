"use client";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "../ui/primitives/button";
import { Input } from "../ui/primitives/input";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/primitives/card";
import { Wifi } from "lucide-react";

export default function RPCConfig() {
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
            <Wifi size={24} />
            RPC Endpoint
          </CardTitle>
          <CardDescription className="text-stone-500 dark:text-white/50">
            Change the default RPC Url for this app.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SetRpcUrlInput />
        </CardContent>
      </Card>
    </motion.div>
  );
}

const SetRpcUrlInput = () => {
  const [rpcUrl, setRpcUrl] = useState("");
  const isValidUrl = (url: string) => {
    const urlPattern = new RegExp(
      "^(https?:\\/\\/)?" + // validate protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    );
    return !!urlPattern.test(url);
  };

  const onSubmit = async () => {
    document.cookie = `x-rpc-url=${rpcUrl}`;
    setRpcUrl("");
    window.location.reload();
  };

  return (
    <div>
      <Input
        onChange={(e) => setRpcUrl(e.target.value)}
        placeholder="https://api.mainnet-beta.solana.com"
        defaultValue={rpcUrl}
        className="font-neue tracking-wide placeholder:font-neuelight focus-visible:ring-1 focus-visible:ring-[#A9A9A9]/75 focus-visible:ring-offset-0"
      />
      <Button
        onClick={() =>
          toast.promise(onSubmit(), {
            loading: "Loading...",
            success: "RPC URL set successfully.",
            error: (err) => `${err}`,
          })
        }
        className="mt-6"
      >
        Set RPC Url
      </Button>
    </div>
  );
};
