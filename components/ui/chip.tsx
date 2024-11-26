import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

interface ChipProps {
  label: string;
  color: "red" | "blue" | "green" | "yellow" | "orange" | "stone" | "muted";
}

const colorClasses = {
  muted: "bg-white/[0.03] text-neutral-500",
  stone: "bg-stone-500/30 text-stone-500",
  red: "bg-red-500/30 text-red-500",
  blue: "bg-blue-500/30 text-blue-500",
  green: "bg-green-500/30 text-green-500",
  yellow: "bg-yellow-500/30 text-yellow-500",
  orange: "bg-orange-500/30 text-orange-500",
};

export default function Chip({ label, color }: ChipProps) {
  return (
    <div
      className={cn(
        `w-fit flex gap-3 items-center justify-start py-1 px-2.5 rounded-full pointer-events-none`,
        colorClasses[color]
      )}
    >
      <p className={`font-neue text-xs`}>{label}</p>
    </div>
  );
}

export function ChipWithLink({
  label,
  href,
  color,
}: ChipProps & { href: string }) {
  return (
    <Link href={href} passHref>
      <div
        className={cn(
          `w-fit flex gap-1.5 items-center justify-start py-1 px-2.5 rounded-full pointer-events-none`,
          colorClasses[color]
        )}
      >
        <p className={`font-neue text-[9px]`}>{label}</p>
        <ExternalLink
          strokeWidth={1}
          className="w-2.5 h-2.5 text-neutral-400/75 hover:text-neutral-400"
        />
      </div>
    </Link>
  );
}
