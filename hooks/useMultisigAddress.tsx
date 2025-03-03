import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

const MULTISIG_STORAGE_KEY = 'x-multisig';

const getMultisigAddress = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(MULTISIG_STORAGE_KEY) || null;
  }
  return null;
};

export const useMultisigAddress = () => {
  const queryClient = useQueryClient();

  const { data: multisigAddress } = useSuspenseQuery({
    queryKey: [MULTISIG_STORAGE_KEY],
    queryFn: async () => getMultisigAddress(), // Always resolves
  });

  const setMultisigAddress = useMutation({
    mutationFn: async (newAddress: string | null) => {
      if (newAddress) {
        localStorage.setItem(MULTISIG_STORAGE_KEY, newAddress);
      } else {
        localStorage.removeItem(MULTISIG_STORAGE_KEY); // Remove if null
      }
      return newAddress;
    },
    onSuccess: (newAddress) => {
      queryClient.setQueryData([MULTISIG_STORAGE_KEY], newAddress);
    },
  });

  return { multisigAddress, setMultisigAddress };
};
