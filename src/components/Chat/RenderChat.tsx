import React from 'react';
import { ChatMessage } from '.';
import { AccAddress } from '@xpla/xpla.js';
import { truncate } from '@xpla.kitchen/utils';

const RenderChat = ({ chat, userAddress }: { chat: ChatMessage[], userAddress: AccAddress }) => {

  return <div className="beauty-scroll overflow-y-auto max-h-full flex flex-1 flex-col pr-4 scrollbar-gutter-stable">
    {
      chat.map(({ address, message, timestamp }, index) => (
        <div
          key={`address${message}`}
          className={`flex ${address === userAddress ? 'justify-end' : 'justify-start'} mb-2`}
        >
          <div className={`max-w-xs p-2 rounded-lg ${address === userAddress ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
            <p className="font-bold">{truncate(address, [5, 3])}</p>
            <p>{message}</p>
            <p>{timestamp.toString()}</p>
          </div>
        </div>
      ))
    }
    
  </div>
}

export default RenderChat;

