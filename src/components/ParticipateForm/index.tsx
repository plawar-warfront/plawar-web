import { useConnectedWallet } from '@xpla/wallet-provider';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { TextField } from '@mui/material';
import { lcd } from '../../lcd';

const ParticipateForm = () => {
    const [balance, setBalance] = useState<string | null>();
    const connectedWallet = useConnectedWallet();
    const [state, setState] = useState<{ amount: number; }>({ amount: 10 });

    useEffect(() => {
        if (connectedWallet) {
            lcd.bank.balance(connectedWallet.walletAddress).then(([coins]) => {
                const coinbalance = JSON.parse(coins.toJSON()).filter((c: { amount: string; denom: string; }) => c.denom === 'axpla');
                if (coinbalance.length === 1) {
                    const xplaBalance = new BigNumber(coinbalance[0].amount).dividedBy(10 ** 18).toFixed(2);
                    setBalance(xplaBalance);
                } else {
                    setBalance('0');
                }
            });
        } else {
            setBalance(null);
        }
    }, [connectedWallet]);
    const onAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    const onButtonClick = async (e: FormEvent, team: string) => {
        e.preventDefault();
        const { amount } = state;
        console.log(amount, team)
        // socket.emit('message', { address: wallets[0].xplaAddress, message });


        // try {
        //     const tx = await connectedWallet?.post({
        //       msgs: [
        //         new MsgSend(
        //           connectedWallet.walletAddress,
        //           "xpla1uywstydn25neas7e4f4ahnesmhv7e2y9nqfqql",
        //           {
        //             axpla: "1" + "000000" + "000000" + "000000",
        //           }
        //         ),
        //       ],
        //     });

        //     if (tx?.result.txhash) {

        //     }
        //   } catch (e) {
        //     alert(
        //       "Tx Error! Maybe no xpla or sequence mismatch.. Please Retry!"
        //     );
        //   }
        setState({ amount: 10 });
    };


    return <form className="flex justify-center items-center py-[32px] gap-[30px]">
        <button
            onClick={(e) => onButtonClick(e, 'blue')}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-20 rounded">
            Button
        </button>
        <div>
            내 잔액 : {balance} <br />
            <TextField
                type="number"
                name="amount"
                onChange={onAmountChange}
                InputProps={{ inputProps: { min: 0 } }}
                value={state.amount}
                variant="outlined"
                label="Amount"
                required
            />
        </div>
        <button
            onClick={(e) => onButtonClick(e, 'red')}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-20 rounded">
            Button
        </button>
    </form>
}

export default ParticipateForm;