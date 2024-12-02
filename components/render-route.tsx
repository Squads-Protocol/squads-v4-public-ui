"use client";

interface RenderRouteProps {
  children: React.ReactNode;
}

export default function RenderMultisigRoute({
  children,
}: RenderRouteProps) {
  return <div className="w-full">{children}</div>;
}
