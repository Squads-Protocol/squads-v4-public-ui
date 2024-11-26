"use client";
import { usePathname } from "next/navigation";
import MultisigInput from "./settings/set-multisig";

interface RenderRouteProps {
  multisig: boolean;
  children: React.ReactNode;
}

export default function RenderMultisigRoute({
  multisig,
  children,
}: RenderRouteProps) {
  const pathname = usePathname();

  if (multisig) {
    return <div className="w-full">{children}</div>;
  }

  if (pathname == "/settings" || pathname == "/create") {
    return <div className="w-full">{children}</div>;
  } else {
    return <MultisigInput />;
  }
}
