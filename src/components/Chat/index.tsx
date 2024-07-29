// src/App.tsx
import React, { useState, useEffect, ChangeEvent, FormEvent, useRef, useCallback } from 'react';
import { TextField } from '@mui/material';
import { useWallet } from '@xpla/wallet-provider';
import { socket } from '../../socket';
import axios from "axios";
import Scrollbars from 'react-custom-scrollbars-2';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { ToastContainer, toast } from 'react-toastify';
import ChatList from './ChatList';

export interface ChatMessage {
  address: string;
  message: string;
  timestamp: Date;
}

const PAGE_SIZE = 20

const Chat: React.FC = () => {
  const [state, setState] = useState<{ message: string; }>({ message: '' });

  const { wallets } = useWallet();
  const queryClient = useQueryClient();
  const scrollbarRef = useRef<Scrollbars>(null);

  const baseurl = process.env.REACT_APP_ENV !== "development" ? process.env.REACT_APP_API_URL || '' : 'http://localhost:5641';
  const fetcher = async ({ pageParam = 1 }) => {
    const response = await axios.get<ChatMessage[]>(`${baseurl}/api/chathistory?perPage=${PAGE_SIZE}&page=${pageParam}`);
    if (pageParam === 1) {
      setTimeout(() => {
        scrollbarRef.current?.scrollToBottom();
      }, 100);
    }
    return response.data;
  }

  const {
    data: chatData,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    refetch
  } = useInfiniteQuery(
    {
      queryKey: ['chathistory'],
      queryFn: fetcher,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages, lastPageParam) => {
        if (lastPage.length === 0) {
          return undefined
        }
        return lastPageParam + 1
      },
      getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
        if (firstPageParam <= 1) {
          return undefined
        }
        return firstPageParam - 1
      },
    }
  );
  const isEmpty = chatData?.pages?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData.pages[chatData.pages.length - 1]?.length < PAGE_SIZE);

  const onMessageSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    const { message } = state;

    axios.post(`${baseurl}api/userchat`, {
      "address": wallets[0].xplaAddress,
      "message": message
    })
      .then(() => {
        scrollbarRef.current?.scrollToBottom();
      })
      .catch(console.error);

    setState({ message: '' });
  }, [baseurl, queryClient, state, wallets]);

  const onMessage = useCallback(
    (data: ChatMessage) => {
      queryClient.setQueryData(['chathistory'], (oldData: any) => ({
        pages: [[data], ...oldData.pages],
        pageParams: [0, ...oldData.pageParams]
      }));

      if (scrollbarRef.current) {
        if (
          scrollbarRef.current.getScrollHeight() <
          scrollbarRef.current.getClientHeight() + scrollbarRef.current.getScrollTop() + 150
        ) {
          setTimeout(() => {
            scrollbarRef.current?.scrollToBottom();
          }, 100);
        } else {
          if (wallets && wallets.length > 0 && data.address !== wallets[0].xplaAddress) {
            toast.success('새 메시지가 도착했습니다.', {
              onClick() {
                scrollbarRef.current?.scrollToBottom();
              },
              closeOnClick: true,
            });
          }
        }
      }
    },
    [queryClient],
  );


  useEffect(() => {
    // socket.emit('get chat history');

    // const onChatHistory = (history: ChatMessage[]) => {
    //   setChat(history);
    // }

    socket.on('message', onMessage);
    // socket.on('chat history', onChatHistory);

    return () => {
      socket.off('message', onMessage);
      // socket.off('chat history', onChatHistory);
    }

  }, []);

  const onTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col h-full justify-between mr-4 py-8 w-full">
      <h1>채팅 목록</h1>
      {/* <RenderChat chat={chat}  userAddress={wallets[0].xplaAddress}/> */}
      <ChatList
        scrollbarRef={scrollbarRef}
        isReachingEnd={isReachingEnd}
        isEmpty={isEmpty}
        chatData={chatData}
        fetchNextPage={fetchNextPage}
        userAddress={wallets[0].xplaAddress}
      />
      <ToastContainer position="bottom-right" />
      {/* <MyComponent /> */}
      <form onSubmit={onMessageSubmit} className="w-full">
        <h1>채팅</h1>
        <div className="flex gap-2 w-full justify-between">
          <TextField
            name="message"
            onChange={onTextChange}
            value={state.message}
            variant="outlined"
            label="Message"
            className='w-full'
            required
          />
          <button className="border min-w-[100px]">보내기</button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
