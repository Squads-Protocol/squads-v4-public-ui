"use client";
import { usePathname } from "next/navigation";
import MultisigInput from "./MultisigInput";

interface RenderRouteProps {
  multisig: boolean;
  children: React.ReactNode;
}

export default function RenderMultisigRoute({
  multisig,
  children,
}: RenderRouteProps) {
  const pathname = usePathname();

  return (
    <main className="mt-24 px-8 w-full">
      {multisig ? (
        <div>{children} </div>
      ) : (
        <>
          {pathname == "/settings" || pathname == "/create" ? (
            <div>{children} </div>
          ) : (
            <MultisigInput />
          )}
        </>
      )}
    </main>
  );
}
