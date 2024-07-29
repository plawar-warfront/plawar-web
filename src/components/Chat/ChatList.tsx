import React, { FC, RefObject, useCallback, useEffect, useState } from 'react';
import { ChatMessage } from '.';
import { truncate } from '@xpla.kitchen/utils';
import { InfiniteData } from '@tanstack/react-query';
import Scrollbars, { positionValues } from 'react-custom-scrollbars-2';
import dayjs from 'dayjs';

interface Props {
    scrollbarRef: RefObject<Scrollbars>;
    isReachingEnd?: boolean;
    isEmpty: boolean;
    chatData: InfiniteData<ChatMessage[], unknown> | undefined;
    fetchNextPage: () => Promise<any>;
    userAddress: string;
}
const RenderChat: FC<Props> = ({ scrollbarRef, isReachingEnd, isEmpty, chatData, fetchNextPage, userAddress }) => {
    const [scrollHeight, setScrollHeight] = useState<number>()
    const onScroll = useCallback(
        (values: positionValues) => {
            if (values.scrollTop === 0 && !isReachingEnd && !isEmpty) {
                fetchNextPage();
                console.log(values);
            }
        },
        [isReachingEnd, isEmpty, fetchNextPage, scrollbarRef],
    );

    useEffect(() => {
        if ((chatData?.pageParams.length || 0) > 1) {
            console.log(scrollbarRef.current?.getValues().scrollTop);
            if (scrollbarRef.current?.getValues().scrollTop === 0) {
                console.log("??", scrollbarRef.current?.getValues());
                if (scrollbarRef.current?.getScrollHeight() < (scrollHeight || 1) * (chatData?.pageParams.length || 1)) {
                    scrollbarRef.current?.scrollTop(  scrollbarRef.current?.getScrollHeight() -  (scrollHeight || 1) * ((chatData?.pageParams.length || 1) -1));
                } else {
                    scrollbarRef.current?.scrollTop( scrollHeight || 1);
                }
            } 
        } else {
            console.log("!!", scrollbarRef.current?.getScrollHeight())
            setScrollHeight(scrollbarRef.current?.getScrollHeight())
        }
    }, [chatData])

    return <div className="w-full flex flex-1">
        <Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onScroll}>
            {chatData && <ChatData chatmessages={chatData.pages} userAddress={userAddress} />}
        </Scrollbars>
    </div>
}

export default RenderChat;

const ChatData = ({ chatmessages, userAddress }: { chatmessages: ChatMessage[][], userAddress: string }) => {
    return <>
        { chatmessages.slice(0).reverse().map((chat, index) => {
                const resultArray = Object.values(chat).filter(item => typeof item === 'object' && item !== null && !Array.isArray(item));
                return <ChatPage key={index + 10} resultArray={resultArray} userAddress={userAddress} />

            })}
    </>
}


const ChatPage = ({ resultArray, userAddress }: { resultArray: ChatMessage[], userAddress: string }) => {
    const now = (new Date()).toUTCString();
    return <div>
        {
            resultArray.map(({ address, message, timestamp }, index) => (
                <div
                    key={`address${message}${timestamp}`}
                    className={`flex ${address === userAddress ? 'justify-end' : 'justify-start'} mb-2`}
                >
                    <div className={`max-w-xs p-2 rounded-lg ${address === userAddress ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
                        <p className="font-bold">{truncate(address, [5, 3])}</p>
                        <p>{message}</p>
                        <p>{dayjs(now).format('YYYY-MM-DD') === dayjs(timestamp).format('YYYY-MM-DD') ? dayjs(timestamp).format('HH:mm:ss'): dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')}</p>
                    </div>
                </div>
            ))
        }
    </div>

}