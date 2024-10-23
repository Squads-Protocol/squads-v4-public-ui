import { cn } from "@/lib/utils";

interface ChipProps {
  label: string;
  color: "red" | "blue" | "green" | "yellow" | "orange" | "stone";
}

const colorClasses = {
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
