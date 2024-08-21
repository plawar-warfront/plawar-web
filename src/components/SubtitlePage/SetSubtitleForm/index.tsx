import React, { useState, ChangeEvent, FormEvent } from 'react';
import useSetSubtitle from '../../../useMutation/useSetSubtitle';
import { TextField } from '@mui/material';
import clsx from 'clsx';

const SetSubtitleForm = () => {

    const [blue, setBlue] = useState<string>('');
    const [red, setRed] = useState<string>('');
    const [amount, setAmount] = useState<number>(0);
    const { mutateAsync: setSubtitle } = useSetSubtitle();
    const [requestError, setRequestError] = useState<string | null>(null);
    const [txhash, setTxhash] = useState<string | null>(null);


    const handleBlueChange = (event: ChangeEvent<HTMLInputElement>) => {
        setBlue(event.target.value);
    };

    const handleRedChange = (event: ChangeEvent<HTMLInputElement>) => {
        setRed(event.target.value);
    };
    const handleAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setAmount(Number(value));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const txhash = await setSubtitle({
                blue,
                red,
                amount
            });
            if (txhash) {
                setTxhash(txhash);
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
    };

    return (
        <form onSubmit={handleSubmit} className="min-w-[300px]">
            <div className="flex w-full justify-between items-center mb-2">
                <span>
                    Blue:
                </span>
                <TextField
                    type="text"
                    name="blue"
                    onChange={handleBlueChange}
                    value={blue}
                    variant="outlined"
                    label="Blue"
                    required
                />
            </div>
            <div className="flex w-full justify-between items-center mb-2">
                <span>
                    Red:
                </span>
                <TextField
                    type="text"
                    name="red"
                    onChange={handleRedChange}
                    value={red}
                    variant="outlined"
                    label="Red"
                    required
                />
            </div>
            <div className="flex w-full justify-between items-center mb-2">

                <span>
                    Amount:
                </span>
                <TextField
                    type="number"
                    name="amount"
                    onChange={handleAmountChange}
                    InputProps={{ inputProps: { min: 0 } }}
                    value={amount}
                    variant="outlined"
                    label="Amount"
                    required
                />
            </div>

            <button type="submit"
                className={clsx(" text-white font-bold py-2 px-20 rounded",
                    // !nowWar && "hover:cursor-not-allowed bg-opacity-50",
                    // nowWar && (team === 'red' ? 'hover:bg-red-700' : 'hover:bg-blue-700'),
                    'bg-green-500 hover:bg-green-700'
                )}>
                Set Subtitle</button>
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
        </form>
    );
}

export default SetSubtitleForm;
