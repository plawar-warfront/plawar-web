import { useQuery } from '@tanstack/react-query';
import { plawarContractAddress } from '../../constant';
import { lcd } from '../../lcd';

const useGetNowRound = () => {
  const contractAddress = plawarContractAddress;
  return useQuery({
    queryKey: ['nowRound', contractAddress, Date.now()],
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
    staleTime: 5 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000
  })
}

export default useGetNowRound;