import { useMutation,  useQueryClient } from '@tanstack/react-query';
import { plawarContractAddress } from '../constant';
import { useConnectedWallet } from '@xpla/wallet-provider';
import { MsgExecuteContract } from '@xpla/xpla.js';
import BigNumber from 'bignumber.js';
import { Config } from '../useQuery/useConfig';
import useGetNowGameInfo from '../useQuery/useGetNowGameInfo';

interface Request {
  team: string;
  amount: number;
}

const useParticipateGame = (config: Config) => {
  const contractAddress = plawarContractAddress;
  const connectedWallet = useConnectedWallet();
  const queryClient = useQueryClient();
  const {refetch : gameInfoRefetch} = useGetNowGameInfo();


  const [yearMonthDate, time] = config.start_time.split(' ');
  const [year, month, date] = yearMonthDate.split('-');
  const [hour, minute, second] = time.split(':');

  const startTimedate = new Date(Date.UTC(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(date, 10), parseInt(hour, 10), parseInt(minute, 10), parseInt(second, 10)));

  const fetchData = async (param: Request) => {
    const now = new Date();
    const secDiff = ((now.getTime() - startTimedate.getTime()) / (60 * 1000));

    const round_min = config.war_min + config.truce_min;
    const nowRound = Math.floor(secDiff / (round_min)) + 1;

    const amount = new BigNumber(param.amount).multipliedBy(10 ** 18).toFixed(0);
    if (connectedWallet) {
      const tx = await connectedWallet.post({
        msgs: [new MsgExecuteContract(
          connectedWallet.walletAddress,
          contractAddress,
          {
            "participate": {
              "round": nowRound,
              "team": param.team
            }
          },
          { axpla: amount }
        )]
      });
      return {
        txhash : tx?.result.txhash || '',
        round : nowRound,
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