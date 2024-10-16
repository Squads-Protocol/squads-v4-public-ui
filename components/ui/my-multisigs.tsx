"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MultisigInfo } from "@/lib/types";
import { nFormatter } from "@/lib/nFormatter";
import Link from "next/link";
import { getCachedSquads } from "@/lib/helpers/getCachedMultisigs";
import { toast } from "sonner";
import { getMultisigs } from "@/lib/helpers/getMultisigs";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { AlertOctagon, RefreshCw } from "lucide-react";
import Loading from "./primitives/loading";
import { Button } from "./primitives/button";
import { Card, CardContent, CardHeader, CardTitle } from "./primitives/card";
import { useRouter } from "next/navigation";

export default function MyMultisigs({ rpc }: { rpc: string }) {
  const router = useRouter();
  const { publicKey, connected } = useWallet();
  const [loading, setLoading] = useState<boolean>(false);
  const [accounts, setAccounts] = useState<MultisigInfo[]>([]);

  const connection = new Connection(rpc || clusterApiUrl("mainnet-beta"));

  const getAccounts = async () => {
    if (publicKey) {
      setLoading(true);
      try {
        console.log("Trying cache...");
        const localCache = localStorage.getItem("cached-multisigs");
        const parsed = JSON.parse(localCache!)!;

        if (parsed !== null && parsed.ttl > Date.now()) {
          console.log("Cache found & valid, updating...");

          const cachedData = await getCachedSquads(connection, parsed);
          setAccounts(cachedData.multisigs);
        } else {
          console.log("No cache found, fetching...");
          toast("Fetching Squads Accounts. This may take up to two minutes.");

          const fetchedAccounts = await getMultisigs(connection, publicKey);
          setAccounts(fetchedAccounts);

          localStorage.setItem(
            "cached-multisigs",
            JSON.stringify({
              multisigs: fetchedAccounts,
              // 24 hours
              ttl: Date.now() + 24 * 60 * 60 * 1000,
            })
          );
        }
      } catch (e) {
        console.error(e);
        toast.error(`Error fetching: ${e}`);
      } finally {
        setLoading(false);
      }
    } else {
      setAccounts([]);
    }
  };

  async function refresh() {
    try {
      setLoading(true);
      localStorage.removeItem("cached-multisigs");
      await getAccounts();
    } catch (e) {
      console.error(e);
      toast.error(`Error refreshing: ${e}`);
    } finally {
      setLoading(false);
    }
  }

  const setMultisigCookie = (multisig: string) => {
    document.cookie = `x-multisig=${multisig}; path=/`;
    router.refresh();
  };

  useEffect(() => {
    getAccounts();
  }, [publicKey]);

  if (loading) {
    return (
      <>
        <Card className="w-full font-neue dark:bg-darkforeground dark:border-darkborder/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex gap-4 items-center">
                <CardTitle>My Squads</CardTitle>
                <button
                  onClick={async () => await refresh()}
                  className="bg-stone-500/10 dark:bg-white/[0.03] rounded-full p-1"
                >
                  <RefreshCw className="text-stone-400 w-3 h-3" />
                </button>
              </div>
              <Link href="/create" passHref>
                <Button className="font-neue bg-gradient-to-br from-stone-600 to-stone-800 text-white dark:bg-gradient-to-br dark:from-white dark:to-stone-400 dark:text-stone-700 hover:bg-gradient-to-br hover:from-stone-600 hover:to-stone-700 disabled:text-stone-500 disabled:bg-gradient-to-br disabled:from-stone-800 disabled:to-stone-900 dark:disabled:bg-gradient-to-br dark:disabled:from-stone-300 dark:disabled:to-stone-500 dark:disabled:text-stone-700/50 dark:hover:bg-stone-100 transition duration-200">
                  Create Squad
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[25rem] bg-stone-500/10 dark:bg-white/[0.03] rounded-md p-4">
              <Loading />
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <Card className="w-full font-neue dark:bg-darkforeground dark:border-darkborder/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex gap-4 items-center">
            <CardTitle>My Squads</CardTitle>
            <button
              onClick={async () => await refresh()}
              className="bg-stone-500/10 dark:bg-white/[0.03] rounded-full p-1"
            >
              <RefreshCw className="text-stone-400 w-3 h-3" />
            </button>
          </div>
          <Link href="/create" passHref>
            <Button className="font-neue bg-gradient-to-br from-stone-600 to-stone-800 text-white dark:bg-gradient-to-br dark:from-white dark:to-stone-400 dark:text-stone-700 hover:bg-gradient-to-br hover:from-stone-600 hover:to-stone-700 disabled:text-stone-500 disabled:bg-gradient-to-br disabled:from-stone-800 disabled:to-stone-900 dark:disabled:bg-gradient-to-br dark:disabled:from-stone-300 dark:disabled:to-stone-500 dark:disabled:text-stone-700/50 dark:hover:bg-stone-100 transition duration-200">
              Create Squad
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {accounts.length != 0 && connected ? (
          <>
            <div className="w-full h-[25rem] bg-stone-500/10 dark:bg-white/[0.03] rounded-md p-4">
              {accounts
                .sort((a, b) => b.balance.total - a.balance.total)
                .map((acc, i) => (
                  <>
                    {i > 0 && i < accounts.length && (
                      <hr className="my-2 border-stone-500/25 dark:border-white/[0.25]" />
                    )}
                    <button
                      key={i}
                      onClick={() =>
                        setMultisigCookie(acc.publicKey.toString())
                      }
                      className="w-full flex items-center justify-between p-2 dark:hover:bg-white/[0.04] rounded-md"
                    >
                      <div className="flex gap-4 items-center">
                        <Image
                          src="/default_image.svg"
                          width={50}
                          height={50}
                          alt="Squads Multisig"
                          className="rounded-xl"
                        />
                        <div className="flex flex-col space-y-0.5 justify-start items-start">
                          <p className="font-neue text-stone-700 dark:text-white">
                            {acc.vault.slice(0, 4) +
                              "..." +
                              acc.vault.slice(40, 44)}
                          </p>
                          <p className="font-neue text-xs text-stone-400 dark:text-white/25">
                            Members: {acc.data.members.length}
                          </p>
                        </div>
                      </div>
                      <p className="font-neuemedium text-lg dark:text-white">
                        ${nFormatter(acc.balance.total)}{" "}
                        <span className="ml-1 text-xs font-neue dark:text-white/50">
                          {" "}
                          balance
                        </span>
                      </p>
                    </button>
                  </>
                ))}
            </div>
          </>
        ) : (
          <div className="w-full h-[25rem] flex items-center justify-center bg-stone-500/10 dark:bg-white/[0.03] rounded-md p-4">
            <div className="w-full flex-col justify-center">
              <div className="mx-auto p-3 w-fit bg-stone-500/25 rounded-md">
                <AlertOctagon className="text-stone-400 w-6 h-6" />
              </div>
              <h4 className="mt-4 font-neue font-semibold text-lg text-center text-stone-700 dark:text-white/75">
                No Squads Yet.
              </h4>
              <p className="mt-2 font-neue text-base text-center text-stone-400 dark:text-white/25">
                Click below to deploy your first Squad.
              </p>
              <div className="mt-4 flex justify-center">
                <Link href="/create" passHref>
                  <Button className="font-neue bg-gradient-to-br from-stone-600 to-stone-800 text-white dark:bg-gradient-to-br dark:from-white dark:to-stone-400 dark:text-stone-700 hover:bg-gradient-to-br hover:from-stone-600 hover:to-stone-700 disabled:text-stone-500 disabled:bg-gradient-to-br disabled:from-stone-800 disabled:to-stone-900 dark:disabled:bg-gradient-to-br dark:disabled:from-stone-300 dark:disabled:to-stone-500 dark:disabled:text-stone-700/50 dark:hover:bg-stone-100 transition duration-200">
                    Create Squad
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
