import { headers } from "next/headers";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import RenderMultisigRoute from "@/components/render-route";
import Header from "@/components/layout/header";
import { ThemeProvider } from "next-themes";
import { CustomToaster } from "@/components/layout/custom-toaster";
import { isMultisigAddress } from "@/lib/checks/isMultisig";
import { SolanaProvider } from "@/providers/SolanaProvider";
import { getClusterName } from "@arrangedev/detect-cluster";
import { getSquadMetadata } from "./routes/get-squad-metadata";
import SidebarLayout from "@/components/layout/dashboard";

const AppLayout = async ({ children }: { children: React.ReactNode }) => {
  const multisigCookie = headers().get("x-multisig");
  const rpcUrl = headers().get("x-rpc-url");
  const connection = new Connection(rpcUrl || clusterApiUrl("mainnet-beta"));

  const multisig = await isMultisigAddress(connection, multisigCookie!);
  const cluster = rpcUrl ? await getClusterName(rpcUrl) : null;

  const metadata = await getSquadMetadata();

  return (
    <>
      <RenderMultisigRoute multisig={multisig} children={children} />
      <CustomToaster />
    </>
  );
};

export default AppLayout;
