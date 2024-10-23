import Image from "next/image";

interface SendInputProps {
  amount: number;
  setAmount: React.Dispatch<React.SetStateAction<number>>;
  label?: string;
  icon?: string;
}

export default function SendInput({
  amount,
  setAmount,
  label,
  icon,
}: SendInputProps) {
  return (
    <div className="relative">
      <input
        name="amount"
        type="number"
        step="any"
        value={amount}
        min={1}
        placeholder="0"
        className={`w-full h-32 bg-transparent font-neuelight text-white/75 border-b border-darkborder/30 text-6xl text-center dark:caret-slate-200 focus:ring-0 placeholder:text-white/25`}
        onChange={(e) => setAmount(parseFloat(e.target.value))}
      />
      {label && (
        <div className="absolute inset-y-12 right-4 flex gap-2 items-center justify-center bg-white/[0.1] font-neue rounded-full px-3 py-1.5">
          {icon && (
            <Image
              src={icon}
              alt={label}
              width={10}
              height={10}
              className="w-4 h-4 rounded-full"
            />
          )}
          <p className="text-base text-white/75">{label}</p>
        </div>
      )}
    </div>
  );
}
