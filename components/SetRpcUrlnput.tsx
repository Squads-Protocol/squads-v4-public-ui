"use client";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
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
      toast.success("RPC Url set successfully.");
      setRpcUrl("");
      router.refresh();
    } else {
      toast.error("Please enter a valid URL.");
    }
  };

  return (
    <div>
      <Input
        onChange={(e) => setRpcUrl(e.target.value)}
        placeholder="https://api.mainnet-beta.solana.com"
        className=""
        value={rpcUrl}
      />
      {!isValidUrl(rpcUrl) && rpcUrl.length > 0 && (
        <p className="text-xs mt-2">Please enter a valid URL.</p>
      )}
      <Button
        onClick={onSubmit}
        disabled={!isValidUrl(rpcUrl) && rpcUrl.length > 0}
        className="mt-2"
      >
        Set RPC Url
      </Button>
    </div>
  );
};

export default SetRpcUrlInput;
