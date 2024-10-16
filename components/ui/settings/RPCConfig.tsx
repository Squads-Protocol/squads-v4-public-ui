"use client";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "../primitives/button";
import { Input } from "../primitives/input";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../primitives/card";

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
      <Card className="dark:bg-darkforeground dark:border-darkborder/30">
        <CardHeader>
          <CardTitle className="font-neuemedium">RPC Endpoint</CardTitle>
          <CardDescription className="font-neue text-muted-foreground dark:text-white/50">
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
    if (isValidUrl(rpcUrl)) {
      document.cookie = `x-rpc-url=${rpcUrl}`;
      setRpcUrl("");
      window.location.reload();
    } else {
      throw "Please enter a valid URL.";
    }
  };

  return (
    <div>
      <Input
        onChange={(e) => setRpcUrl(e.target.value)}
        placeholder="https://api.mainnet-beta.solana.com"
        defaultValue={rpcUrl}
        className="font-neue tracking-wide placeholder:font-neuelight focus-visible:ring-1 focus-visible:ring-[#A9A9A9]/75 focus-visible:ring-offset-0"
      />
      {!isValidUrl(rpcUrl) && rpcUrl.length > 0 && (
        <p className="font-neuelight text-red-500 text-xs mt-2">
          Please enter a valid URL.
        </p>
      )}
      <Button
        onClick={() =>
          toast.promise(onSubmit(), {
            loading: "Loading...",
            success: "RPC URL set successfully.",
            error: (err) => `${err}`,
          })
        }
        disabled={!isValidUrl(rpcUrl) && rpcUrl.length > 0}
        className="mt-6 font-neue bg-gradient-to-br from-stone-600 to-stone-800 text-white dark:bg-gradient-to-br dark:from-white dark:to-stone-400 dark:text-stone-700 hover:bg-gradient-to-br hover:from-stone-600 hover:to-stone-700 disabled:text-stone-500 disabled:bg-gradient-to-br disabled:from-stone-800 disabled:to-stone-900 dark:disabled:bg-gradient-to-br dark:disabled:from-stone-300 dark:disabled:to-stone-500 dark:disabled:text-stone-700/50 dark:hover:bg-stone-100 transition duration-200"
      >
        Set RPC Url
      </Button>
    </div>
  );
};
