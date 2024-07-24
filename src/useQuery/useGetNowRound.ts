import { useQuery } from '@tanstack/react-query';
import { plawarContractAddress } from '../constant';
import { lcd } from '../lcd';

const useGetNotRound = () => {
  const contractAddress = plawarContractAddress;
  return useQuery({
    queryKey: ['nowRound', contractAddress],
    queryFn: async () => {
      try {
        const nowRound = await lcd.wasm.contractQuery<number>(contractAddress, {
          get_now_round :{ }
      });
        return nowRound;
      } catch (e) {
        console.log(e);
      }
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000
  })
}

export default useGetNotRound;