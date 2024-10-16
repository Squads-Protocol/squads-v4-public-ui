"use client";
import { useState } from "react";
import { Input } from "./ui/primitives/input";
import { Button } from "./ui/primitives/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const SetRpcUrlInput = () => {
  const [rpcUrl, setRpcUrl] = useState("");
  const router = useRouter();
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
      router.refresh();
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
        className=""
      />
      {!isValidUrl(rpcUrl) && rpcUrl.length > 0 && (
        <p className="text-xs mt-2">Please enter a valid URL.</p>
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
        className="mt-4 font-neue bg-gradient-to-br from-stone-600 to-stone-800 text-white dark:bg-gradient-to-br dark:from-white dark:to-stone-400 dark:text-stone-700 hover:bg-gradient-to-br hover:from-stone-600 hover:to-stone-700 disabled:text-stone-500 disabled:bg-gradient-to-br disabled:from-stone-800 disabled:to-stone-900 dark:disabled:bg-gradient-to-br dark:disabled:from-stone-300 dark:disabled:to-stone-500 dark:disabled:text-stone-700/50 dark:hover:bg-stone-100 transition duration-200"
      >
        Set RPC Url
      </Button>
    </div>
  );
};

export default SetRpcUrlInput;
