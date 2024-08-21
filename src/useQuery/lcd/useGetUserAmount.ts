import { useQuery } from '@tanstack/react-query';
import { plawarContractAddress } from '../../constant';
import { lcd } from '../../lcd';

export interface UserAmount {
  team: string;
  amount: string;
}

const useGetUserAmount = (round: number, userAddress: string) => {
  const contractAddress = plawarContractAddress;
  return useQuery({
    queryKey: ['useGetUserAmount', round, userAddress, contractAddress],
    queryFn: async () => {
      try {
        const data = await lcd.wasm.contractQuery<{ 0: string, 1: string }>(contractAddress, {
          get_user_amount: {
            round,
            useraddress: userAddress
          }
        });
        const userAmount: UserAmount = {
          team: data[0],
          amount: data[1]
        }
        return userAmount;
      } catch (e) {
        console.log(e);
      }
    },
  })
}

export default useGetUserAmount;