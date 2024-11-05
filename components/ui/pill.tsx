import Image from "next/image";
import * as bs58 from "bs58";

interface PillProps {
  label: string;
  value?: string;
  image?: string;
}

export default function Pill({ label, value, image }: PillProps) {
  return (
    <div
      className={`flex gap-2 items-center justify-start bg-stone-200/75 dark:bg-darkforeground border border-darkborder/10 py-1 px-2.5 rounded-full pointer-events-none`}
    >
      {image && (
        <div>
          <Image
            src={image}
            alt={label}
            width={10}
            height={10}
            className="w-3 h-3 rounded-full"
          />
        </div>
      )}
      <p className="font-neue text-stone-600 dark:text-white/75 text-xs">
        {label}
        {value && (
          <span className="font-neue ml-1 tracking-wide text-stone-500/75 dark:text-stone-400">
            {" "}
            {value}
          </span>
        )}
      </p>
    </div>
  );
}
