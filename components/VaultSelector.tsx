'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useVaultIndex } from '@/hooks/useVaultIndex';

// Generate vault indices from 0 to 15
const vaultIndices = Array.from({ length: 16 }, (_, index) => ({
  value: index.toString(),
  label: `Vault ${index}`,
}));

export function VaultSelector() {
  const { vaultIndex, setVaultIndex } = useVaultIndex(); // Use React Query hook
  const [open, setOpen] = React.useState(false);
  const selectedValue = vaultIndex.toString(); // Ensure string comparison

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === selectedValue ? '0' : currentValue;
    setVaultIndex.mutate(parseInt(newValue, 10)); // Ensure numeric storage
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedValue ? `Vault ${selectedValue}` : 'Select Vault Index...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search Vault Index..." />
          <CommandEmpty>No vault index found.</CommandEmpty>
          <CommandGroup>
            {vaultIndices.map((vaultIndex) => (
              <CommandItem key={vaultIndex.value} value={vaultIndex.value} onSelect={handleSelect}>
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    selectedValue === vaultIndex.value ? 'opacity-100' : 'opacity-0'
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
