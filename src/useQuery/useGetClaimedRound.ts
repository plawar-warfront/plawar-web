import { useQuery } from '@tanstack/react-query';
import { plawarContractAddress } from '../constant';
import { lcd } from '../lcd';

const useGetClaimedRound = () => {
  const contractAddress = plawarContractAddress;
  return useQuery({
    queryKey: ['useGetClaimedRound', contractAddress],
    queryFn: async () => {
      try {
        const claimedRound = await lcd.wasm.contractQuery<number[]>(contractAddress, {
          get_claimed_round: {}
        });
        return claimedRound;
      } catch (e) {
        console.log(e);
      }
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000
  })
}

export default useGetClaimedRound;