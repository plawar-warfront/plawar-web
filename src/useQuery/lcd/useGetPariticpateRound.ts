import { useQuery } from '@tanstack/react-query';
import { plawarContractAddress } from '../../constant';
import { lcd } from '../../lcd';

const useGetParticipateRound = (userAddress: string) => {
  const contractAddress = plawarContractAddress;
  return useQuery({
    queryKey: ['useGetParticipateRound', userAddress, contractAddress],
    queryFn: async () => {
      try {
        const data = await lcd.wasm.contractQuery<number[]>(contractAddress, {
          get_participate_round: {
            useraddress: userAddress
          }
        });

        return data;
      } catch (e) {
        console.log(e);
      }
    },
  })
}

export default useGetParticipateRound;