import { useQuery } from '@tanstack/react-query';
import { plawarContractAddress } from '../../constant';
import axios from "axios";

export interface Subtitle {
  blue: string,
  red: string,
  user_address: string,
  amount: string, // (uint128)
}

export interface NowGameInfo {
  nowround: number,
  now_truce: boolean,
  block_height: number,
  red_team_amount: string,
  blue_team_amount: string,
  recent_red_participants: { 0: string, 1: string }[], // (addr, uint128)
  recent_blue_participants: { 0: string, 1: string }[],
  claimed_round: number[],
  subtitles: Subtitle[],
  now_subtitle: Subtitle
}

const useGetNowContractInfoFromAPI = () => {
  const baseurl = process.env.REACT_APP_ENV !== "development" ? `${process.env.REACT_APP_API_URL || ''}/discord` : 'http://localhost:5641';

  return useQuery({
    queryKey: ['useGetNowContractInfoFromAPI', plawarContractAddress, baseurl],
    queryFn: async () => {
      try {
        const response = await axios.get<NowGameInfo>(`${baseurl}/api/contractinfo`);
        return response.data;
      } catch (e) {
        console.log(e);
      }
    },
    staleTime: 6 * 1000,
    gcTime: 6 * 1000,
    refetchInterval: 6 * 1000
  })
}

export default useGetNowContractInfoFromAPI;