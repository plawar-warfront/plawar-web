import { useQuery } from '@tanstack/react-query';
import { plawarContractAddress } from '../../constant';
import axios from "axios";

export interface Gamestate {
  redSoldierNum : string,
  blueSoldierNum : string,
  warPosition : string,
}

const useGetGamestateFromAPI = () => {
  const baseurl = process.env.REACT_APP_ENV !== "development" ? `${process.env.REACT_APP_API_URL || ''}/discord` : 'http://localhost:5641';

  return useQuery({
    queryKey: ['useGetGamestateFromAPI', plawarContractAddress, baseurl],
    queryFn: async () => {
      try {
        const response = await axios.get<{status : string, data: Gamestate, message? :string}>(`${baseurl}/api/gamestate`);
        return response.data.data;
      } catch (e) {
        console.log(e);
      }
    },
    staleTime: 6 * 1000,
    gcTime: 6 * 1000,
    refetchInterval: 6 * 1000
  })
}

export default useGetGamestateFromAPI;