import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from '@/components/ui/button';
import { useMultisigAddress } from '@/hooks/useMultisigAddress';

export function ChangeMultisig() {
  const { setMultisigAddress } = useMultisigAddress(); // Use React Query hook

  const handleChangeMultisig = () => {
    setMultisigAddress.mutate(null); // Wipes out the stored multisig address
  };

  return (
    <Card className="w-fit my-3 pt-5">
      <CardContent>
        <Button onClick={handleChangeMultisig}>Change</Button>
      </CardContent>
    </Card>
  );
}
