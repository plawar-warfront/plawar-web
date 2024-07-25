import { useMutation, useQueryClient } from '@tanstack/react-query';
import { claimContractAddress } from '../constant';
import { useConnectedWallet } from '@xpla/wallet-provider';
import { MsgExecuteContract } from '@xpla/xpla.js';

interface Request {
  stage: number
}

const useUserClaim = () => {
  const contractAddress = claimContractAddress;
  const connectedWallet = useConnectedWallet();
  const queryClient = useQueryClient();

  const fetchData = async (param: Request) => {
    const tx = await connectedWallet?.post({
      msgs: [new MsgExecuteContract(
        connectedWallet.walletAddress,
        contractAddress,
        {
          "claim": {
            "stages": [param.stage]
          }
        }

      )]
    });

    return {
      txhash: tx?.result.txhash || '',
      address: connectedWallet?.walletAddress
    };
  };

  return useMutation({
    mutationFn: fetchData,
    mutationKey: ['useUserClaim', contractAddress, Date.now()],
    onSuccess: (res) => {
      setTimeout(async () => {
        await queryClient.invalidateQueries({
          queryKey: ['useGetUserCanClaimStage', res.address, contractAddress],
        });

      }, 6000)
    },
    onError: (err) => {
      throw err;
    }
  })
}

export default useUserClaim;