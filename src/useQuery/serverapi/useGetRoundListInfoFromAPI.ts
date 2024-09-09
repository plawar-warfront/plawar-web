import { useQuery } from '@tanstack/react-query';
import { plawarContractAddress } from '../../constant';
import axios from "axios";
import { RoundInfo } from './useGetRoundInfoFromAPI';

const useGetRoundListInfoFromAPI = (rounds : string) => {
  const baseurl = process.env.REACT_APP_ENV !== "development" ? `${process.env.REACT_APP_API_URL || ''}/discord` : 'http://localhost:5641';

  return useQuery({
    queryKey: ['useGetRoundListInfoFromAPI', plawarContractAddress, baseurl, rounds],
    queryFn: async () => {
      try {
        const response = await axios.get<RoundInfo[]>(`${baseurl}/api/roundlistinfo?rounds=${rounds}`);
        return response.data;
      } catch (e) {
        console.log(e);
      }
    },
    staleTime: 30 * 1000,
    gcTime: 30 * 1000,
    refetchInterval: 30 * 1000
  })
}

export default useGetRoundListInfoFromAPI;