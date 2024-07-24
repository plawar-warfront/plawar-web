import React from 'react';
import { useTimer } from 'react-timer-hook';

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
    const { totalSeconds } = useTimer({ expiryTimestamp, onExpire: () => setNowWar(!nowWar) });

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
