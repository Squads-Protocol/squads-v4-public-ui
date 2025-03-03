import { useMemo } from 'react';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { useRpcUrl, useProgramId } from '@/hooks/useSettings';
import { useVaultIndex } from '@/hooks/useVaultIndex';
import { useMultisigAddress } from '@/hooks/useMultisigAddress';
import * as multisig from '@sqds/multisig';

export const useMultisigData = () => {
  // Fetch settings from React Query hooks
  const { rpcUrl } = useRpcUrl();
  const { programId: storedProgramId } = useProgramId();
  const { multisigAddress } = useMultisigAddress();
  const { vaultIndex } = useVaultIndex();

  // Ensure we have a valid RPC URL (fallback to mainnet-beta)
  const effectiveRpcUrl = rpcUrl || clusterApiUrl('mainnet-beta');
  const connection = useMemo(() => new Connection(effectiveRpcUrl), [effectiveRpcUrl]);

  // Compute programId safely
  const programId = useMemo(
    () => (storedProgramId ? new PublicKey(storedProgramId) : multisig.PROGRAM_ID),
    [storedProgramId]
  );

  // Compute the multisig vault PDA
  const multisigVault = useMemo(() => {
    if (multisigAddress) {
      return multisig.getVaultPda({
        multisigPda: new PublicKey(multisigAddress),
        index: vaultIndex,
        programId,
      })[0];
    }
    return null;
  }, [multisigAddress, vaultIndex, programId]);

  return {
    rpcUrl: effectiveRpcUrl,
    connection,
    multisigAddress,
    vaultIndex,
    programId,
    multisigVault,
  };
};
