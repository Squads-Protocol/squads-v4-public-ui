'use client';

import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { isPublickey } from '@/lib/isPublickey';
import { useProgramId } from '@/hooks/useSettings'; // Now using React Query!

const SetProgramIdInput = () => {
  const { programId: storedProgramId, setProgramId } = useProgramId(); // Use React Query
  const [programId, setProgramIdState] = useState(storedProgramId || '');
  const router = useRouter();

  const publicKeyTest = isPublickey(programId);

  const onSubmit = async () => {
    if (publicKeyTest) {
      await setProgramId.mutateAsync(programId); // Use React Query mutation
      setProgramIdState(''); // Clear input field after submission
      router.refresh(); // Refresh the page (if necessary)
    } else {
      throw 'Please enter a valid program.';
    }
  };

  return (
    <div>
      <Input
        onChange={(e) => setProgramIdState(e.target.value)}
        placeholder={storedProgramId || 'SQDS4ep65T869zMMBKyuUq6aD6EgTu8psMjkvj52pCf'}
        value={programId} // Sync input state with stored value
        className=""
      />
      {!publicKeyTest && programId.length > 0 && (
        <p className="text-xs mt-2 text-red-500">Please enter a valid key.</p>
      )}
      <Button
        onClick={() =>
          toast.promise(onSubmit(), {
            loading: 'Updating Program ID...',
            success: 'Program ID set successfully.',
            error: (err) => `${err}`,
          })
        }
        disabled={!publicKeyTest && programId.length > 0}
        className="mt-2"
      >
        Set Program ID
      </Button>
    </div>
  );
};

export default SetProgramIdInput;
