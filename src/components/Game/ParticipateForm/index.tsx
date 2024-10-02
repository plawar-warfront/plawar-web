import React, { ChangeEvent, FormEvent,  useState } from 'react';
import { TextField } from '@mui/material';
import { Config } from '../../../useQuery/lcd/useConfig';
import getWarTime from '../../../util/getWarTime';
import { useTimer } from 'react-timer-hook';
import clsx from 'clsx';
import useParticipateGame from '../../../useMutation/useParticipateGame';
import useUserBalance from '../../../useQuery/lcd/useUserBalance';
import { plawarContractOwner } from '../../../constant';
import RegisterPrize from './RegisterPrize';

const ParticipateForm = ({ config, latestBlock, address }: { config: Config, latestBlock : number, address?: string }) => {
    const [userInput, setUserInput] = useState<{ amount: number; }>({ amount: 10 });

    const blockinterval = latestBlock - config.startblockheight;
    const remainder = blockinterval % (config.warblocknum + config.truceblocknum);
    const [nowWar, setNowWar] = useState(remainder >= config.warblocknum);

    const [requestError, setRequestError] = useState<string | null>(null);
    const [txhash, setTxhash] = useState<string | null>(null);


    const onAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value });
    };

    const { mutateAsync: participateGame } = useParticipateGame(config);
    

    const onButtonClick = async (e: FormEvent, team: string) => {
        e.preventDefault();
        const { amount } = userInput;
        try {
            if (!address) {
                throw new Error("Please connect wallet");
            }
            const res = await participateGame({
                team,
                amount,
                latestBlock
            });
            if (res) {
                setTxhash(res.txhash);
                setRequestError(null);
            } else {
                throw new Error("There is no txhash.");
            }
        } catch (e) {
            setRequestError(
                `${e instanceof Error ? e.message : String(e)}`
            );
            setTxhash(null);
        }
        setUserInput({ amount: 10 });
    };

    return <div className="flex flex-col items-center">
        {
            address === plawarContractOwner && <RegisterPrize />
        }
        <form className="flex justify-center items-center py-[32px] gap-[30px]">
            <TeamButton
                nowWar={nowWar}
                setNowWar={setNowWar}
                initialSeconds={nowWar ? ((config.warblocknum - remainder) * 6) : ((config.warblocknum + config.truceblocknum - remainder) * 6)}
                team={"blue"}
                onButtonClick={onButtonClick}
            />
            <div>
                {address && <Balance
                    address={address} />}
                <br />
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
                initialSeconds={nowWar ?((config.warblocknum - remainder) * 6) : ((config.warblocknum + config.truceblocknum - remainder) * 6)}
                team={"red"}
                onButtonClick={onButtonClick}
            />
        </form>
        <div className="max-w-[600px] ">
            {
                txhash && <a
                    href={`https://explorer.xpla.io/testnet/tx/${txhash}`}
                    target="_blank"
                    className="text-[#00B1FF] overflow-hidden whitespace-nowrap text-ellipsis w-full max-w-[210px] inline-block"
                >
                    {txhash}
                </a>
            }
            {
                requestError && <span className="text-[#FF3C24] font-medium text-[15px] leading-[18px] ">
                    {requestError}
                </span>
            }
        </div>
    </div>
}

const Balance = ({ address }: { address: string }) => {
    const { data: balance } = useUserBalance(address);
    return <>
        내 잔액 : {balance}
    </>
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
    return <button
        // disabled={nowWar === false}
        onClick={(e) => onButtonClick(e, team)}
        className={clsx(" text-white font-bold py-2 px-20 rounded",
            // !nowWar && "hover:cursor-not-allowed bg-opacity-50",
            // nowWar && (team === 'red' ? 'hover:bg-red-700' : 'hover:bg-blue-700'),
            team === 'red' ? 'bg-red-500 hover:bg-red-700' : 'bg-blue-500 hover:bg-blue-700'
        )}>
        Button
    </button>
}

export default ParticipateForm;