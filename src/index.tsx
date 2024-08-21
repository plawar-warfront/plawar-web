import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {
  getChainOptions,
  WalletProvider,
} from "@xpla/wallet-provider";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MyPage from './components/MyPage';
import GameInfoPage from './components/GameInfoPage';
import SubtitlePage from './components/SubtitlePage';
import Game from './components/Game';

const queryClient = new QueryClient()

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
getChainOptions().then((chainOptions) => {
  root.render(
    <WalletProvider {...chainOptions}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/plawar-web" element={<Game />} />
            <Route path="/plawar-web/mypage" element={<MyPage />} />
            <Route path="/plawar-web/gameinfopage" element={<GameInfoPage />} />
            <Route path="/plawar-web/setsubtitle" element={<SubtitlePage />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </WalletProvider>
  );
});
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

