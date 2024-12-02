import { MultisigInfo } from "@/lib/types";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface SquadRowProps {
  index: number;
  accounts: MultisigInfo[];
  squad: MultisigInfo;
}

export default function SquadRow({ index, accounts, squad }: SquadRowProps) {
  const router = useRouter();
  const { theme } = useTheme();

  const logo =
    theme == "dark" ? "/assets/default_image_light.svg" : "/assets/default_image.svg";

  const setMultisigCookie = (multisig: string) => {
    document.cookie = `x-multisig=${multisig}; path=/`;
    router.refresh();
  };

  return (
    <div className="w-full">
      {index > 0 && index < accounts.length && (
        <hr className="my-2 border-darkborder/10" />
      )}
      <button
        onClick={() => {
          setMultisigCookie(squad.publicKey.toString());
        }}
        className="w-full flex items-center justify-between p-2 dark:hover:bg-white/[0.04] rounded-md"
      >
        <div className="flex gap-4 items-center">
          <Image
            src={logo}
            width={50}
            height={50}
            alt="Squads Multisig"
            className="rounded-xl"
          />
          <div className="flex flex-col space-y-0.5 justify-start items-start">
            <p className="font-neue text-stone-700 dark:text-white">
              {squad.vault.slice(0, 4) + "..." + squad.vault.slice(-4)}
            </p>
            <p className="font-neue text-xs text-stone-400 dark:text-white/25">
              Members: {squad.data.members.length}
            </p>
          </div>
        </div>
        {/*
        <p className="font-neuemedium text-lg dark:text-white">
          ${nFormatter(squad.balance.total)}{" "}
          <span className="ml-1 text-xs font-neue dark:text-white/50">
            {" "}
            balance
          </span>
        </p>
        */}
      </button>
    </div>
  );
}
