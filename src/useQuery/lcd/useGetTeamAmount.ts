import { useQuery } from '@tanstack/react-query';
import { plawarContractAddress } from '../../constant';
import { lcd } from '../../lcd';

export interface TeamAmount {
  red: string;
  blue: string;
}

const useGetTeamAmount = (round: number) => {
  const contractAddress = plawarContractAddress;
  return useQuery({
    queryKey: ['useGetTeamAmount', round, contractAddress],
    queryFn: async () => {
      try {
        const teamAmount = await lcd.wasm.contractQuery<TeamAmount>(contractAddress, {
          get_team_amount: {
            round
          }
        });
        return teamAmount;
      } catch (e) {
        console.log(e);
      }
    },
  })
}

export default useGetTeamAmount;