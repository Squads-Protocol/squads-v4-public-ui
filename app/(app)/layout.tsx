import { headers } from "next/headers";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import RenderMultisigRoute from "@/components/render-route";
import Header from "@/components/layout/header";
import { ThemeProvider } from "next-themes";
import { CustomToaster } from "@/components/layout/custom-toaster";
import { isMultisigAddress } from "@/lib/checks/isMultisig";
import { SolanaProvider } from "@/providers/SolanaProvider";
import { getClusterName } from "@arrangedev/detect-cluster";

const AppLayout = async ({ children }: { children: React.ReactNode }) => {
  const multisigCookie = headers().get("x-multisig");
  const rpcUrl = headers().get("x-rpc-url");
  const connection = new Connection(rpcUrl || clusterApiUrl("mainnet-beta"));

  const multisig = await isMultisigAddress(connection, multisigCookie!);
  const cluster = rpcUrl ? await getClusterName(rpcUrl) : null;

  return (
    <SolanaProvider rpc={rpcUrl}>
      <ThemeProvider defaultTheme="dark" attribute="class">
        <main className="flex flex-col md:flex-row h-screen min-w-full">
          <Header
            multisig={multisig ? multisigCookie : null}
            cluster={cluster}
          />
          <RenderMultisigRoute multisig={multisig} children={children} />
        </main>
        <CustomToaster />
      </ThemeProvider>
    </SolanaProvider>
  );
};

export default AppLayout;
