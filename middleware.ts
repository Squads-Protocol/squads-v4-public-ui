import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  // Create supabase client and get session
  const res = NextResponse.next();

  // Set the "x-pathname" header
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", req.nextUrl.pathname);

  const cookie = req.cookies.get("x-multisig")?.value;
  if (cookie) {
    requestHeaders.set("x-multisig", cookie);
  }

  const rpcUrl = req.cookies.get("x-rpc-url")?.value || process.env.NEXT_PUBLIC_RPC_URL;
  if (rpcUrl) {
    requestHeaders.set("x-rpc-url", rpcUrl);
  }

  const vaultIndex = req.cookies.get("x-vault-index")?.value;
  if (vaultIndex) {
    requestHeaders.set("x-vault-index", vaultIndex);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
