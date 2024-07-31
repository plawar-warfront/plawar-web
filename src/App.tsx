import "./App.css";
import Connect from "./components/Connect";
import Chat from "./components/Chat";
import { WalletStatus, useWallet } from "@xpla/wallet-provider";
import Game from "./components/Game";
import Header from "./components/Header";
import 'react-toastify/dist/ReactToastify.css';
import GameScreen from "./components/Game/GameScreen";

function App() {
  const { status, wallets } = useWallet();
  return (
    <div className="App min-h-screen ">
      <Header />
      <div className="flex h-[calc(100vh-80px)]">
        <GameScreen />
        <div className="flex justify-end items-center h-full min-w-[500px]">
          {status === WalletStatus.WALLET_CONNECTED && wallets.length > 0 ?
            <Chat />
            :
            <div >
              Please Connect Wallet!
            </div>
          }
        </div>
      </div>
    </div>
  );
}

export default App;
