import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useRpcUrl, useProgramId } from './useSettings';

const DEFAULT_VAULT_INDEX = 0; // Default when missing

const getVaultIndex = () => {
  if (typeof window !== 'undefined') {
    const storedValue = localStorage.getItem('x-vault-index');
    return storedValue ? parseInt(storedValue, 10) : DEFAULT_VAULT_INDEX;
  }
  return DEFAULT_VAULT_INDEX;
};

export const useVaultIndex = () => {
  const queryClient = useQueryClient();
  const { rpcUrl } = useRpcUrl(); // Dependency
  const { programId } = useProgramId(); // Dependency

  const { data: vaultIndex } = useSuspenseQuery({
    queryKey: ['vaultIndex', rpcUrl, programId],
    queryFn: async () => {
      if (!rpcUrl || !programId) {
        return null; // Prevent query from running if dependencies are missing
      }
      return getVaultIndex();
    },
  });

  const setVaultIndex = useMutation({
    mutationFn: async (newIndex: number) => {
      if (newIndex) {
        localStorage.setItem('x-vault-index', newIndex.toString());
      } else {
        localStorage.removeItem('x-vault-index'); // Handle null case
      }
      return newIndex;
    },
    onSuccess: (newIndex) => {
      queryClient.setQueryData(['vaultIndex', rpcUrl, programId], newIndex);
    },
  });

  return { vaultIndex: vaultIndex ?? DEFAULT_VAULT_INDEX, setVaultIndex };
};
