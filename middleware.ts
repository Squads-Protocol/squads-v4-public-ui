import { NextRequest, NextResponse } from "next/server";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { isMultisigAddress } from "./lib/checks/isMultisig";

const PROTECTED_ROUTES = ["/", "/transactions", "/config"];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", req.nextUrl.pathname);

  const rpcUrl = req.cookies.get("x-rpc-url")?.value;
  if (rpcUrl) {
    requestHeaders.set("x-rpc-url", rpcUrl);
  } else {
    requestHeaders.set("x-rpc-url", clusterApiUrl("mainnet-beta"));
  }

  const cookie = req.cookies.get("x-multisig")?.value;
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    req.nextUrl.pathname.startsWith(route),
  );

  if (
    isProtectedRoute &&
    !cookie &&
    path !== "/set-squad" &&
    path !== "/settings"
  ) {
    const response = NextResponse.redirect(new URL("/set-squad", req.url));
    response.headers.forEach((value, key) => requestHeaders.set(key, value));
    return response;
  }

  if (cookie && rpcUrl && path !== "/set-squad" && path !== "/settings") {
    try {
      const connection = new Connection(rpcUrl);
      const isValid = await isMultisigAddress(connection, cookie);

      if (!isValid && isProtectedRoute) {
        const response = NextResponse.redirect(new URL("/set-squad", req.url));
        response.headers.forEach((value, key) =>
          requestHeaders.set(key, value),
        );
        return response;
      }
      requestHeaders.set("x-multisig", cookie);
    } catch (error) {
      console.error("Error validating multisig:", error);
      if (isProtectedRoute) {
        const response = NextResponse.redirect(new URL("/set-squad", req.url));
        response.headers.forEach((value, key) =>
          requestHeaders.set(key, value),
        );
        return response;
      }
    }
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

export const config = {
  matcher: [
    "/((?!api|assets|tokens|_next/static|_next/image|favicon.ico|robots.txt|png|svg|jpg).*)",
  ],
};
