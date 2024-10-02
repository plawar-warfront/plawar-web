import { useQuery } from '@tanstack/react-query';
import { plawarContractAddress } from '../../constant';
import { lcd } from '../../lcd';

export interface Config {
  airdrop_address: string;
  airdrop_percent: number;
  delegation_address: string;
  delegation_percent: number;
  description: string;
  owner: string;
  owner_candidate: string;
  profit_address: string;
  profit_percent: number;
  startblockheight: number;
  truceblocknum: number;
  warblocknum: number;
}

const useConfig = () => {
  const contractAddress = plawarContractAddress;
  return useQuery({
    queryKey: ['contract config', contractAddress],
    queryFn: async () => {
      try {
        const contractConfig = await lcd.wasm.contractQuery<Config>(contractAddress, {
          config: {}
        });
        return contractConfig;
      } catch (e) {
        console.log(e);
      }
    },
  })

}

export default useConfig;