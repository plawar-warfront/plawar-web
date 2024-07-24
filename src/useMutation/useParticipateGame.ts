import { useMutation, useQuery } from '@tanstack/react-query';
import { plawarContractAddress } from '../constant';
import { lcd } from '../lcd';
import { useConnectedWallet } from '@xpla/wallet-provider';
import { MsgExecuteContract } from '@xpla/xpla.js';
import BigNumber from 'bignumber.js';
import { Config } from '../useQuery/useConfig';

interface Request {
  team: string;
  amount : number;
}

const useParticipateGame = (config : Config) => {
  const contractAddress = plawarContractAddress;
  const connectedWallet = useConnectedWallet();

  
  const [yearMonthDate, time] = config.start_time.split(' ');
  const [year, month, date] = yearMonthDate.split('-');
  const [hour, minute, second] = time.split(':');

  const startTimedate = new Date(Date.UTC(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(date, 10), parseInt(hour, 10), parseInt(minute, 10), parseInt(second, 10)));
  
  const fetchData = async (param: Request) => {
    const now = new Date();
    const secDiff = ((now.getTime() - startTimedate.getTime()) / (60 * 1000));
  
    const round_min = config.war_min + config.truce_min;
    const nowRound =  Math.floor(secDiff / (round_min)) + 1;

    const amount = new BigNumber(param.amount).multipliedBy(10 ** 18).toFixed(0);
    const tx = await connectedWallet?.post({
      msgs: [new MsgExecuteContract(
        connectedWallet.walletAddress,
        contractAddress,
        {
          "distribute": {
            "round": nowRound,
            "team": param.team
          }
        },
        { axpla: amount }
      )]
    });

    return tx?.result.txhash;
  };

  return useMutation({
    mutationFn: fetchData,
    mutationKey: ['useParticipateGame', contractAddress, Date.now()],
    onSuccess: () => {
      // if (data.returnCode !== "0") {
      //     if (data.returnCode === "499" && data.returnMsg.includes("insufficient funds")) {
      //         throw new Error("601");
      //     } else {
      //         throw new Error(data.returnCode);
      //     }
      // }
    },
    onError: (err) => {
      throw err;
    }
  })
}

export default useParticipateGame;