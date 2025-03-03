'use client';

import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useRpcUrl } from '@/hooks/useSettings'; // Now using React Query!

const SetRpcUrlInput = () => {
  const { rpcUrl: storedRpcUrl, setRpcUrl } = useRpcUrl(); // Use React Query
  const [rpcUrl, setRpcUrlState] = useState(storedRpcUrl || '');
  const router = useRouter();

  const isValidUrl = (url: string) => {
    const urlPattern = new RegExp(
      '^(https?:\\/\\/)?' + // validate protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i'
    );
    return !!urlPattern.test(url);
  };

  const onSubmit = async () => {
    if (isValidUrl(rpcUrl)) {
      await setRpcUrl.mutateAsync(rpcUrl); // Use React Query mutation
      setRpcUrlState(''); // Clear input field after submission
      router.refresh(); // Refresh the page (if necessary)
    } else {
      throw 'Please enter a valid URL.';
    }
  };

  return (
    <div>
      <Input
        onChange={(e) => setRpcUrlState(e.target.value)}
        placeholder={storedRpcUrl || 'https://api.mainnet-beta.solana.com'}
        value={rpcUrl} // Sync input state with stored value
        className=""
      />
      {!isValidUrl(rpcUrl) && rpcUrl.length > 0 && (
        <p className="text-xs mt-2">Please enter a valid URL.</p>
      )}
      <Button
        onClick={() =>
          toast.promise(onSubmit(), {
            loading: 'Updating RPC URL...',
            success: 'RPC URL set successfully.',
            error: (err) => `${err}`,
          })
        }
        disabled={!isValidUrl(rpcUrl) && rpcUrl.length > 0}
        className="mt-2"
      >
        Set RPC Url
      </Button>
    </div>
  );
};

export default SetRpcUrlInput;
