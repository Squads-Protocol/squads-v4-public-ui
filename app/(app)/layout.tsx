import * as multisig from "@sqds/multisig";
import { headers } from "next/headers";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { LucideHome, ArrowDownUp, Users, Settings } from "lucide-react";
import RenderMultisigRoute from "@/components/RenderMultisigRoute";
import Header from "@/components/ui/layout/header";
import { ThemeProvider } from "next-themes";
import { CustomToaster } from "@/components/ui/layout/custom-toaster";

const AppLayout = async ({ children }: { children: React.ReactNode }) => {
  const tabs = [
    {
      name: "Home",
      icon: <LucideHome />,
      route: "/",
    },
    {
      name: "Transactions",
      icon: <ArrowDownUp />,
      route: "/transactions",
    },
    {
      name: "Configuration",
      icon: <Users />,
      route: "/config",
    },
    {
      name: "Settings",
      icon: <Settings />,
      route: "/settings",
    },
  ];

  const headersList = headers();

  const path = headersList.get("x-pathname");
  const multisigCookie = headersList.get("x-multisig");
  const multisig = await isValidPublicKey(multisigCookie!);

  return (
    <ThemeProvider defaultTheme="dark" attribute="class">
      <body>
        <Header />
        <main className="flex flex-col md:flex-row h-screen min-w-full">
          <RenderMultisigRoute multisig={multisig} children={children} />
        </main>
        <CustomToaster />
      </body>
    </ThemeProvider>
  );
};

export default AppLayout;

const isValidPublicKey = async (multisigString: string) => {
  try {
    const multisigPubkey = new PublicKey(multisigString); // This will throw an error if the string is not a valid public key
    const rpcUrl = headers().get("x-rpc-url");
    const connection = new Connection(rpcUrl || clusterApiUrl("mainnet-beta"));
    await multisig.accounts.Multisig.fromAccountAddress(
      connection,
      multisigPubkey
    );
    return true;
  } catch (e) {
    return false;
  }
};
