"use client";
import MultisigInput from "./MultisigInput";
import { useCookie } from '@/app/(app)/cookies';
import { useMultisig } from '@/app/(app)/services';
import { clusterApiUrl, Connection } from '@solana/web3.js';
import { usePathname } from 'next/navigation';
import { Suspense } from 'react';

interface RenderRouteProps {
  children: React.ReactNode;
}

export default function RenderMultisigRoute({
  children,
}: RenderRouteProps) {
  const pathname = usePathname();
  const multisigAddress = useCookie("x-multisig");
  const rpcUrl = useCookie("x-rpc-url");
  console.log("rpcUrl", rpcUrl);
  console.log("multisigAddress", multisigAddress);

  const {data: multisig} = useMultisig(
    new Connection(rpcUrl || clusterApiUrl("mainnet-beta")),
    multisigAddress!);

  return (
    <div className="md:w-9/12 md:ml-auto space-y-2 p-3 pt-4 mt-1 md:space-y-4 md:p-8 md:pt-6 pb-24">
      {multisig ? (
        <div>{children} </div>
      ) : (
        <>
          {pathname == "/settings/" || pathname == "/create/" ? (
            <div>{children} </div>
          ) : (
            <MultisigInput onUpdate={()=> window.location.reload()}/>
          )}
        </>
      )}
    </div>
  );
}
