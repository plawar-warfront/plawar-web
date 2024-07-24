import React, { useState, useEffect } from 'react';

interface TimerProps {
  seconds: number;
  nowWar: boolean;
  setNowWar: React.Dispatch<React.SetStateAction<boolean>>;
}

const Timer: React.FC<TimerProps> = ({ seconds: initialSeconds, nowWar, setNowWar }) => {
  const [seconds, setSeconds] = useState<number>(initialSeconds);
 
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (seconds > 0) {
      timer = setTimeout(() => {
        setSeconds(seconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      setNowWar(!nowWar)
    }
    return () => clearTimeout(timer);
  }, [nowWar, seconds, setNowWar]);

  const formatTime = (sec: number): string => {
    const m: number = Math.floor(sec / 60);
    const s: number = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div >
      <h2>{formatTime(seconds)}</h2>
    </div>
  );
}

export default Timer;
