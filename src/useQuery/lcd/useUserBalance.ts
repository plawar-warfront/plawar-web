import { useQuery } from '@tanstack/react-query';
import axios from "axios";
import { plawarContractAddress } from '../../constant';
import { lcd } from '../../lcd';
import BigNumber from 'bignumber.js';

const useUserBalance = (address: string) => {
  const contractAddress = plawarContractAddress;
  return useQuery({
    queryKey: ['useUserBalance', address, contractAddress],
    queryFn: async () => {
      try {
        const balanace = await lcd.bank.balance(address);
        const coins = balanace[0];
        const coinbalance = JSON.parse(coins.toJSON()).filter((c: { amount: string; denom: string; }) => c.denom === 'axpla');
        if (coinbalance.length === 1) {
            const xplaBalance = new BigNumber(coinbalance[0].amount).dividedBy(10 ** 18).toFixed(2);
            return xplaBalance;
        } else {
            return '0';
        }
      } catch (e) {
        console.log(e);
      }
    },
  })

}

export default useUserBalance;