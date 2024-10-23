import { headers } from "next/headers";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import RenderMultisigRoute from "@/components/RenderMultisigRoute";
import Header from "@/components/ui/layout/header";
import { ThemeProvider } from "next-themes";
import { CustomToaster } from "@/components/ui/layout/custom-toaster";
import { isMultisigAddress } from "@/lib/checks/isMultisig";
import { SolanaProvider } from "@/providers/SolanaProvider";

const AppLayout = async ({ children }: { children: React.ReactNode }) => {
  const multisigCookie = headers().get("x-multisig");
  const rpcUrl = headers().get("x-rpc-url");
  const connection = new Connection(rpcUrl || clusterApiUrl("mainnet-beta"));

  const multisig = await isMultisigAddress(connection, multisigCookie!);

  return (
    <SolanaProvider rpc={rpcUrl}>
      <ThemeProvider defaultTheme="dark" attribute="class">
        <Header multisig={multisig ? multisigCookie : null} />
        <main className="flex flex-col md:flex-row h-screen min-w-full">
          <RenderMultisigRoute multisig={multisig} children={children} />
        </main>
        <CustomToaster />
      </ThemeProvider>
    </SolanaProvider>
  );
};

export default AppLayout;
