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
    <div className="md:w-9/12 md:ml-auto space-y-2 p-3 pt-4 mt-1 md:space-y-4 md:p-8 md:pt-6 pb-24">
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
    </div>
  );
}
