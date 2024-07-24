import { useMutation, useQuery } from '@tanstack/react-query';
import { plawarContractAddress } from '../constant';
import { lcd } from '../lcd';
import { useConnectedWallet } from '@xpla/wallet-provider';
import { MsgExecuteContract } from '@xpla/xpla.js';
import BigNumber from 'bignumber.js';
import { Config } from '../useQuery/useConfig';

interface Request {
  team: string;
  round: number;
}

const useRegisterPrize = () => {
  const contractAddress = plawarContractAddress;
  const connectedWallet = useConnectedWallet();

  const fetchData = async (param: Request) => {
    const tx = await connectedWallet?.post({
      msgs: [new MsgExecuteContract(
        connectedWallet.walletAddress,
        contractAddress,
        {
          "register_prize": {
            "round": param.round,
            "team": param.team
          }
        }
      )]
    });

    return tx?.result.txhash;
  };

  return useMutation({
    mutationFn: fetchData,
    mutationKey: ['useRegisterPrize', contractAddress, Date.now()],
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

export default useRegisterPrize;