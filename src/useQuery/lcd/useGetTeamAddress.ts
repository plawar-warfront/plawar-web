import { useQuery } from '@tanstack/react-query';
import { plawarContractAddress } from '../../constant';
import { lcd } from '../../lcd';

export interface TeamParticipants {
  address: string;
  amount: string;
}

const useGetTeamAddress = (round: number, team: string) => {
  const contractAddress = plawarContractAddress;
  return useQuery({
    queryKey: ['useGetTeamAddress', round, team, contractAddress],
    queryFn: async () => {
      try {
        const data = await lcd.wasm.contractQuery<{ 0: string, 1: string }[]>(contractAddress, {
          get_team_address: {
            round,
            team
          }
        });
        const teamParticipants: TeamParticipants[] = data.map((d) => {
          return {
            address: d[0],
            amount: d[1]
          }
        })
        return teamParticipants;
      } catch (e) {
        console.log(e);
      }
    },
  })
}

export default useGetTeamAddress;