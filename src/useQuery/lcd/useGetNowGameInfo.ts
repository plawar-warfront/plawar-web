import { useQuery } from '@tanstack/react-query';
import { plawarContractAddress } from '../../constant';
import { lcd } from '../../lcd';

export interface NowGameInfo {
  nowround: number,
  red_team_amount: string,
  blue_team_amount: string,
  recent_red_participants: { 0: string, 1: string }[], // (addr, uint128)
  recent_blue_participants: { 0: string, 1: string }[],
  claimed_round: number[],
}

const useGetNowGameInfo = () => {
  const contractAddress = plawarContractAddress;
  return useQuery({
    queryKey: ['useGetNowGameInfo', plawarContractAddress],
    queryFn: async () => {
      try {
        const nowGameInfo = await lcd.wasm.contractQuery<NowGameInfo>(contractAddress, {
          get_now_info_all: {
          }
        });

        return nowGameInfo;
      } catch (e) {
        console.log(e);
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000
  })
}

export default useGetNowGameInfo;