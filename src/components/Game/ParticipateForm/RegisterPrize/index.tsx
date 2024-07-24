import React, { useState, ChangeEvent, FormEvent } from 'react';
import useRegisterPrize from '../../../../useMutation/useRegisterPrize';

const RegisterPrize = () => {

    const [round, setRound] = useState<number | ''>('');
    const [team, setTeam] = useState<string>('');
    const { mutateAsync: registerPrize } = useRegisterPrize();
    const [requestError, setRequestError] = useState<string | null>(null);
    const [txhash, setTxhash] = useState<string | null>(null);


    const handleRoundChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setRound(value === '' ? '' : Number(value));
    };

    const handleTeamChange = (event: ChangeEvent<HTMLInputElement>) => {
        setTeam(event.target.value);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const txhash = await registerPrize({
                round : round || 1,
                team
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
        <form onSubmit={handleSubmit}>
            <div>
                <label>
                    Round:
                    <input
                        type="number"
                        value={round}
                        onChange={handleRoundChange}
                    />
                </label>
            </div>
            <div>
                <label>
                    Team:
                    <input
                        type="text"
                        value={team}
                        onChange={handleTeamChange}
                    />
                </label>
            </div>
            <button type="submit">Claim</button>
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

export default RegisterPrize;
