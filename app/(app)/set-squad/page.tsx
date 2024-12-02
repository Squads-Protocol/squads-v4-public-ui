import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent
} from "../../../components/ui/primitives/tooltip";
import MultisigInput from "../../../components/settings/set-multisig";
import Pill from "../../../components/ui/pill";
import { getClusterName } from "@arrangedev/detect-cluster";
import { headers } from "next/headers";
import Link from "next/link";

export default async function SetSquad() {
  const multisigAddr = headers().get("x-multisig");
  const rpcUrl = headers().get("x-rpc-url");
  const cluster = await getClusterName(rpcUrl!);

  return (
    <div className="h-screen">
      <div className="mx-auto h-full sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden flex flex-col justify-center font-neue w-full h-full px-6 py-24 shadow-2xl sm:rounded-3xl sm:px-24 xl:py-32">
          <h2 className="mx-auto max-w-3xl text-center text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Add a Squads multisig address
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-center text-lg text-neutral-400">
            Paste the address of a Squads multisig account (not a vault) below to get started.
          </p>
          <MultisigInput rpc={rpcUrl} current={multisigAddr} cluster={cluster!} />
          <div className="mt-6 text-center text-xs text-neutral-500">
            {cluster && (
              <Link href="/settings">
                <TooltipProvider>
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger>
                      <Pill
                        label={cluster}
                        image={
                          cluster.includes("solana")
                            ? "/assets/solana.svg"
                            : cluster.includes("eclipse")
                              ? "/assets/eclipse.svg"
                              : "/assets/default_image_light.svg"
                        }
                      />
                    </TooltipTrigger>
                    <TooltipContent className="bg-lightbackground dark:bg-darkbackground border border-border/30 dark:border-darkborder/10">
                      <p className="font-neue text-xs text-stone-700 dark:text-stone-50">
                        Current SVM cluster
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Link>
            )}
          </div>
          <svg
            viewBox="0 0 1024 1024"
            aria-hidden="true"
            className="absolute left-1/2 top-3/4 -z-10 size-[64rem] -translate-x-1/2"
          >
            <circle r={512} cx={512} cy={512} fill="url(#759c1415-0410-454c-8f7c-9a820de03641)" fillOpacity="0.7" />
            <defs>
              <radialGradient
                r={1}
                cx={0}
                cy={0}
                id="759c1415-0410-454c-8f7c-9a820de03641"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(512 512) rotate(90) scale(512)"
              >
                <stop stopColor="#A9A9A9" />
                <stop offset={1} stopColor="#ffffff" stopOpacity={0} />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  )
}
