import { useQuery } from '@tanstack/react-query';
import { plawarContractAddress } from '../../constant';
import axios from "axios";


export interface RoundInfo {
  round : number,
  winresult : string,
  hasparticipants : boolean,
  txhash : string | undefined,
  claimStage : number| undefined,
  timestamp : string
}

const useGetRoundInfoFromAPI = (round : number) => {
  const baseurl = process.env.REACT_APP_ENV !== "development" ? `${process.env.REACT_APP_API_URL || ''}/discord` : 'http://localhost:5641';

  return useQuery({
    queryKey: ['useGetRoundInfoFromAPI', plawarContractAddress, baseurl, round],
    queryFn: async () => {
      try {
        const response = await axios.get<{status : string, data: RoundInfo, message? :string}>(`${baseurl}/api/roundinfo?round=${round}`);
        return response.data.data;
      } catch (e) {
        console.log(e);
      }
    },
    staleTime: 30 * 1000,
    gcTime: 30 * 1000,
    refetchInterval: 30 * 1000
  })
}

export default useGetRoundInfoFromAPI;