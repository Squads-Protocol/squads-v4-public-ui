"use client";
import { createExplorerAddressUrl } from "@/lib/helpers/createExplorerUrl";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ExplorerAddressLinkButton({
  addr,
  cluster,
}: {
  addr: string;
  cluster?: string;
}) {
  return (
    <Link
      href={createExplorerAddressUrl({ publicKey: addr, cluster: cluster })}
      className="text-stone-500/75 dark:text-stone-400 hover:text-stone-200"
      passHref
    >
      <ExternalLink strokeWidth={1} className="h-4 w-4" />
    </Link>
  );
}
