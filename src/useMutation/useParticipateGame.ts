import { useMutation,  useQueryClient } from '@tanstack/react-query';
import { plawarContractAddress } from '../constant';
import { useConnectedWallet } from '@xpla/wallet-provider';
import { MsgExecuteContract } from '@xpla/xpla.js';
import BigNumber from 'bignumber.js';
import { Config } from '../useQuery/lcd/useConfig';
import useGetNowContractInfoFromAPI from '../useQuery/serverapi/useGetNowContractInfoFromAPI';

interface Request {
  team: string;
  amount: number;
  latestBlock : number;
}

const useParticipateGame = (config: Config) => {
  const contractAddress = plawarContractAddress;
  const connectedWallet = useConnectedWallet();
  const queryClient = useQueryClient();
  const {refetch : gameInfoRefetch} = useGetNowContractInfoFromAPI();

  const fetchData = async (param: Request) => {
    const amount = new BigNumber(param.amount).multipliedBy(10 ** 18).toFixed(0);
    const nowround = ((param.latestBlock - config.startblockheight) / (config.warblocknum + config.truceblocknum) ) + 1;
    if (connectedWallet) {
      const tx = await connectedWallet.post({
        msgs: [new MsgExecuteContract(
          connectedWallet.walletAddress,
          contractAddress,
          {
            "participate": {
              "round": nowround,
              "team": param.team
            }
          },
          { axpla: amount }
        )]
      });
      return {
        txhash : tx?.result.txhash || '',
        round : nowround,
        team : param.team,
        address : connectedWallet.walletAddress
      };

    } else {
      throw new Error('not connected');
    }

  };

  return useMutation({
    mutationFn: fetchData,
    mutationKey: ['useParticipateGame', contractAddress, Date.now()],
    onSuccess: async (res) => {
      setTimeout(async () => {
        await gameInfoRefetch();
        await queryClient.invalidateQueries({
          queryKey: ['useUserBalance', res.address, contractAddress],
        });
        await queryClient.invalidateQueries({
          queryKey: ['useUserParticipateRoundInfo', res.address, contractAddress],
        });
      }, 6000)
    },
    onError: (err) => {
      throw err;
    }
  })
}

export default useParticipateGame;