import { useQuery } from '@tanstack/react-query';
import { lcd } from '../../lcd';

export interface UserAmount {
  team: string;
  amount: string;
}

const useLatestBlock = () => {
  return useQuery({
    queryKey: ['useLatestBlock'],
    queryFn: async () => {
      try {
        const data = await lcd.tendermint.blockInfo();
        return data.block.header.height;
      } catch (e) {
        console.log(e);
      }
    },
    refetchInterval:  3 * 1000
  })
}

export default useLatestBlock;