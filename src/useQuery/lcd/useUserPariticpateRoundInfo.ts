import { useQuery } from '@tanstack/react-query';
import { plawarContractAddress } from '../../constant';
import { lcd } from '../../lcd';

export interface UserParticipateRoundInfoAPIResponse {
  data : UserParticipateRoundInfo[],
  total : number,
  offset : number,
  limit : number,
  order : number
}

export interface UserParticipateRoundInfo {
  round : number,
  amount: string,
  team : string,
}

const useUserParticipateRoundInfo = (address: string, offset = 0, limit = 10, order = "desc") => {
  const contractAddress = plawarContractAddress;
  return useQuery({
    queryKey: ['useUserParticipateRoundInfo', address, contractAddress, offset, limit, order],
    queryFn: async () => {
      try {
        const data = await lcd.wasm.contractQuery<UserParticipateRoundInfoAPIResponse>(contractAddress, {
          get_participate_round_all_info: {
            useraddress: address,
            offset,
            limit,
            order
          }
        });

        return data;
      } catch (e) {
        console.log(e);
      }
    },
    staleTime: 1 * 60 * 1000,
    gcTime: 1 * 60 * 1000,
    refetchInterval: 1 * 60 * 1000
  })
}

export default useUserParticipateRoundInfo;