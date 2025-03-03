'use client';
import MultisigInput from './MultisigInput';
import { usePathname } from 'next/navigation';
import { useMultisigData } from '@/hooks/useMultisigData';

interface RenderRouteProps {
  children: React.ReactNode;
}

export default function RenderMultisigRoute({ children }: RenderRouteProps) {
  const pathname = usePathname();
  const { multisigAddress: multisig } = useMultisigData();

  return (
    <div className="md:w-9/12 md:ml-auto space-y-2 p-3 pt-4 mt-1 md:space-y-4 md:p-8 md:pt-6 pb-24">
      {multisig ? (
        <div>{children} </div>
      ) : (
        <>
          {pathname == '/settings/' || pathname == '/create/' ? (
            <div>{children} </div>
          ) : (
            <MultisigInput onUpdate={() => null} />
          )}
        </>
      )}
    </div>
  );
}
