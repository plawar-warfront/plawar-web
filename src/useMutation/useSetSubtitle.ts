import { useMutation, useQuery } from '@tanstack/react-query';
import { plawarContractAddress } from '../constant';
import { useConnectedWallet } from '@xpla/wallet-provider';
import { MsgExecuteContract } from '@xpla/xpla.js';
import BigNumber from 'bignumber.js';


interface Request {
  blue: string;
  red: string;
  amount: number;
}

const useSetSubtitle = () => {
  const contractAddress = plawarContractAddress;
  const connectedWallet = useConnectedWallet();

  const fetchData = async (param: Request) => {
    const amount = new BigNumber(param.amount).multipliedBy(10 ** 18).toFixed(0);
    const tx = await connectedWallet?.post({
      msgs: [new MsgExecuteContract(
        connectedWallet.walletAddress,
        contractAddress,
        {
          "register_subtitle": {
            "blue": param.blue,
            "red": param.red,
          }
        },
        { axpla: amount }
      )]
    });

    return tx?.result.txhash;
  };

  return useMutation({
    mutationFn: fetchData,
    mutationKey: ['useSetSubtitle', contractAddress, Date.now()],
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

export default useSetSubtitle;