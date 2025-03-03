'use client';

import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useMultisigAddress } from '@/hooks/useMultisigAddress';

const MultisigInput = ({ onUpdate }: { onUpdate: () => void }) => {
  const { multisigAddress, setMultisigAddress } = useMultisigAddress();
  const [multisig, setMultisig] = useState(multisigAddress || '');

  const onSubmit = async () => {
    if (multisig.trim().length > 0) {
      await setMultisigAddress.mutateAsync(multisig); // Save using React Query
      onUpdate(); // Trigger any additional UI updates
    } else {
      console.error('Multisig address cannot be empty.');
    }
  };

  return (
    <div
      className="
        w-full max-w-4xl mx-auto
        px-4 sm:px-6 lg:px-8
        py-6 md:py-10
        space-y-4
        min-h-screen
      "
    >
      <h1>Enter Multisig Address</h1>
      <p className="text-gray-500 text-sm">
        There is no multisig set in Local Storage. Set it by entering its Public Key below.
      </p>
      <Input
        type="text"
        placeholder="Multisig Address"
        className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 sm:text-sm mt-2"
        value={multisig}
        onChange={(e) => setMultisig(e.target.value)}
      />
      <Button onClick={onSubmit} className="mt-4">
        Set Multisig
      </Button>
    </div>
  );
};

export default MultisigInput;
