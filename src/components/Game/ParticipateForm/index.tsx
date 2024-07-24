import { useConnectedWallet } from '@xpla/wallet-provider';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { TextField } from '@mui/material';
import { lcd } from '../../../lcd';
import { Config } from '../../../useQuery/useConfig';
import getWarTime from '../../../util/getTimer';
import { useTimer } from 'react-timer-hook';
import clsx from 'clsx';

const ParticipateForm = ({ config }: { config: Config }) => {
    const [balance, setBalance] = useState<string | null>();
    const connectedWallet = useConnectedWallet();
    const [userInput, setUserInput] = useState<{ amount: number; }>({ amount: 10 });

    const warTime = getWarTime(config.war_min, config.truce_min, config.start_time);
    const [nowWar, setNowWar] = useState(warTime < config.war_min * 60);

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
        setUserInput({ ...userInput, [e.target.name]: e.target.value });
    };

    const onButtonClick = async (e: FormEvent, team: string) => {
        e.preventDefault();
        const { amount } = userInput;
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
        setUserInput({ amount: 10 });
    };

    return <form className="flex justify-center items-center py-[32px] gap-[30px]">
        <TeamButton
            nowWar={nowWar}
            setNowWar={setNowWar}
            initialSeconds={nowWar ? (config.war_min * 60 - warTime) : (config.war_min + config.truce_min) * 60 - warTime}
            team={"blue"}
            onButtonClick={onButtonClick}
        />
        <div>
            내 잔액 : {balance} <br />
            <TextField
                type="number"
                name="amount"
                onChange={onAmountChange}
                InputProps={{ inputProps: { min: 0 } }}
                value={userInput.amount}
                variant="outlined"
                label="Amount"
                required
            />
        </div>
        <TeamButton
            nowWar={nowWar}
            setNowWar={setNowWar}
            initialSeconds={nowWar ? (config.war_min * 60 - warTime) : (config.war_min + config.truce_min) * 60 - warTime}
            team={"red"}
            onButtonClick={onButtonClick}
        />
    </form>
}


const TeamButton = ({ initialSeconds, nowWar, setNowWar, team, onButtonClick }: {
    initialSeconds: number;
    nowWar: boolean;
    setNowWar: React.Dispatch<React.SetStateAction<boolean>>;
    team: string;
    onButtonClick: (e: FormEvent, team: string) => Promise<void>;
}) => {
    const time = new Date();
    time.setSeconds(time.getSeconds() + initialSeconds);
    return <TeamButtonComponent
        expiryTimestamp={time}
        nowWar={nowWar}
        setNowWar={setNowWar}
        team={team}
        onButtonClick={onButtonClick}
    />
}

const TeamButtonComponent = ({ expiryTimestamp, setNowWar, nowWar, team, onButtonClick }: {
    expiryTimestamp: Date; nowWar: boolean;
    setNowWar: React.Dispatch<React.SetStateAction<boolean>>;
    team: string;
    onButtonClick: (e: FormEvent, team: string) => Promise<void>;
}) => {
    useTimer({ expiryTimestamp, onExpire: () => setNowWar(!nowWar) });
    return   <button
            disabled={nowWar === false}
            onClick={(e) => onButtonClick(e, team)}
            className={clsx(" text-white font-bold py-2 px-20 rounded",
                !nowWar && "hover:cursor-not-allowed bg-opacity-50",
                nowWar && (team === 'red' ? 'hover:bg-red-700':'hover:bg-blue-700'), 
                team === 'red' ? 'bg-red-500 ' : 'bg-blue-500 '
            )}>
            Button
        </button>
}

export default ParticipateForm;