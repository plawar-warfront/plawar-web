import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { useTimer } from 'react-timer-hook';
import { plawarContractAddress } from '../../../constant';
import useGetNowContractInfoFromAPI from '../../../useQuery/useGetNowContractInfoFromAPI';
import { WalletStatus, useWallet } from '@xpla/wallet-provider';

interface TimerProps {
    seconds: number;
    nowWar: boolean;
    setNowWar: React.Dispatch<React.SetStateAction<boolean>>;
}

const Timer: React.FC<TimerProps> = ({ seconds: initialSeconds, nowWar, setNowWar }) => {
    const time = new Date();
    time.setSeconds(time.getSeconds() + initialSeconds);

    return <TimerComponent
        expiryTimestamp={time}
        nowWar={nowWar}
        setNowWar={setNowWar}
    />
}

const TimerComponent = ({ expiryTimestamp, setNowWar, nowWar }: {
    expiryTimestamp: Date; nowWar: boolean;
    setNowWar: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const { refetch: gameInfoRefetch } = useGetNowContractInfoFromAPI();
    const { status, wallets } = useWallet();
    const queryClient = useQueryClient();

    const { totalSeconds } = useTimer({
        expiryTimestamp, onExpire: async () => {
            // 아래 api 호출 await 없어도 되나?
            gameInfoRefetch();
            if (status === WalletStatus.WALLET_CONNECTED && wallets.length > 0) {
                queryClient.invalidateQueries({
                    queryKey: ['useUserParticipateRoundInfo', wallets[0].xplaAddress, plawarContractAddress],
                });
            }
            setTimeout(async () => {
                await gameInfoRefetch();
                if (status === WalletStatus.WALLET_CONNECTED && wallets.length > 0) {
                    await queryClient.invalidateQueries({
                        queryKey: ['useUserParticipateRoundInfo', wallets[0].xplaAddress, plawarContractAddress],
                    });
                }
            }, 10 * 1000);
            setNowWar(!nowWar); // api 호출 전에 있어도 되나?
        }
    });

    const formatTime = (sec: number): string => {
        const m: number = Math.floor(sec / 60);
        const s: number = sec % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div >
            <h2>{formatTime(totalSeconds)}</h2>
        </div>
    );
}

export default Timer;
