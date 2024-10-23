"use client";
import { Copy } from "lucide-react";
import { toast } from "sonner";

export default function CopyTextButton({ text }: { text: string }) {
  const copyText = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard.", { duration: 5000 });
  };

  return (
    <button
      onClick={async () => await copyText(text)}
      className="text-stone-500/75 dark:text-stone-400 hover:text-stone-200"
    >
      <Copy strokeWidth={1} className="h-4 w-4" />
    </button>
  );
}
