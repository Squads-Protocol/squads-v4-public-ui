"use client";
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/primitives/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/primitives/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/primitives/popover";
import { useRouter } from "next/navigation";

// Generate vault indices from 0 to 255
const vaultIndices = Array.from({ length: 16 }, (_, index) => ({
  value: index.toString(),
  label: `Vault ${index}`,
}));

export function VaultSelector() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const router = useRouter();

  React.useEffect(() => {
    document.cookie = `x-vault-index=${value}; path=/`;
    router.refresh();
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between font-neue bg-stone-800 text-white hover:text-white dark:bg-white dark:text-stone-700 disabled:text-stone-500 disabled:bg-stone-800 dark:disabled:bg-stone-300 dark:disabled:text-stone-700/50 transition duration-200"
        >
          {value ? `Vault ${value}` : "Select Vault Index..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 font-neue">
        <Command className="bg-stone-800 text-white dark:bg-white dark:text-stone-700">
          <CommandInput
            placeholder="Search Vault Index..."
            className="placeholder:text-white/25 dark:placeholder:text-stone-700/40"
          />
          <CommandEmpty>No vault index found.</CommandEmpty>
          <CommandGroup className="text-white dark:text-stone-700">
            {vaultIndices.map((vaultIndex) => (
              <CommandItem
                key={vaultIndex.value}
                value={vaultIndex.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
                className="hover:bg-white/50 hover:text-stone-700 aria-selected:bg-white/50 aria-selected:text-stone-700 dark:hover:bg-stone-500/50 dark:aria-selected:bg-stone-500/50"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === vaultIndex.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {vaultIndex.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
