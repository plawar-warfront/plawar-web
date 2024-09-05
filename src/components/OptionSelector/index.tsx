import React, { useState } from 'react';
import useShowGameType from '../../zustand/useShowGameType';
import clsx from "clsx";

const OptionSelector = () => {
    const { showGameType, setShowGameType } = useShowGameType();

    const handleClick = (option: "auto" | "game" | "info") => {
        setShowGameType(option);
    };

    return (
        <div className='flex gap-2 w-full justify-center mb-2'>
            <button
                className={clsx(" text-white font-bold py-2 px-2 rounded",
                    showGameType === 'auto' ? 'bg-[#00B1FF] ' : 'bg-gray-500'
                )}
                onClick={() => handleClick('auto')}
            >
                Auto
            </button>
            <button
                className={clsx(" text-white font-bold py-2 px-2 rounded",
                showGameType === 'game' ? 'bg-[#00B1FF] ' : 'bg-gray-500'
            )}
                onClick={() => handleClick('game')}
            >
                Game
            </button>
            <button
                className={clsx(" text-white font-bold py-2 px-2 rounded",
                showGameType === 'info' ? 'bg-[#00B1FF] ' : 'bg-gray-500'
            )}
                onClick={() => handleClick('info')}
            >
                Info
            </button>
        </div>
    );
}

export default OptionSelector;
