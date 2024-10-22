import { useState, useEffect, useCallback } from "react";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { CachedData, MultisigInfo } from "../types";
import { toast } from "sonner";
import { getMultisigs } from "../helpers/getMultisigs";
import { getCachedSquads } from "../helpers/getCachedMultisigs";
import { MS_CACHE_COOKIE_NAME, MS_CACHE_TTL } from "../consts";

export function useMultisigAccounts(rpc?: string) {
  const { publicKey, connected } = useWallet();

  const [loading, setLoading] = useState<boolean>(false);
  const [accounts, setAccounts] = useState<MultisigInfo[]>([]);

  const connection = new Connection(rpc || clusterApiUrl("mainnet-beta"));

  const getCachedData = useCallback((): CachedData | null => {
    if (typeof window === "undefined") return null; // Are we server-side?

    const cookieData = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${MS_CACHE_COOKIE_NAME}=`))
      ?.split("=")[1];

    if (!cookieData) return null;

    try {
      return JSON.parse(decodeURIComponent(cookieData));
    } catch (error) {
      console.error("Error parsing cached data:", error);
      return null;
    }
  }, []);

  const setCachedData = useCallback((data: CachedData) => {
    if (typeof window === "undefined") return; // Are we server-side?

    const encoded = encodeURIComponent(JSON.stringify(data));
    document.cookie = `${MS_CACHE_COOKIE_NAME}=${encoded}; path=/; max-age=${
      MS_CACHE_TTL / 1000
    }; SameSite=Strict`;
  }, []);

  const getAccounts = useCallback(async () => {
    if (!connected || !publicKey) {
      setAccounts([]);
      return;
    }

    setLoading(true);
    try {
      const cachedData = getCachedData();

      if (cachedData && cachedData.ttl > Date.now()) {
        console.log("Cache found & valid, updating...");
        const cache = await getCachedSquads(connection, cachedData);
        setAccounts(cache.multisigs);
      } else {
        console.log("Cache invalid or not found, refreshing...");
        toast("Fetching Squads Accounts. This may take up to two minutes.");

        const freshAccounts = await refreshAccounts(publicKey);
        setAccounts(freshAccounts);
      }
    } catch (e) {
      console.error(e);
      toast.error(`Error fetching: ${e}`);
    } finally {
      setLoading(false);
    }
  }, [publicKey, connection]);

  const refreshAccounts = useCallback(
    async (publicKey: PublicKey): Promise<MultisigInfo[]> => {
      toast("Fetching Squads Accounts. This may take up to two minutes.");
      const fetchedAccounts = await getMultisigs(connection, publicKey);
      setCachedData({
        multisigs: fetchedAccounts,
        ttl: Date.now() + MS_CACHE_TTL,
      });
      return fetchedAccounts;
    },
    [connection, setCachedData]
  );

  useEffect(() => {
    getAccounts();
  }, [publicKey, getAccounts]);

  return { loading, accounts, refreshAccounts };
}
