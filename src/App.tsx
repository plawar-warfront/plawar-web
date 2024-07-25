import "./App.css";
import Connect from "./components/Connect";
import Chat from "./components/Chat";
import { WalletStatus, useWallet } from "@xpla/wallet-provider";
import Game from "./components/Game";
import Header from "./components/Header";

function App() {
  const { status, wallets } = useWallet();
  return (
    <div className="App min-h-screen ">
      <Header />
      <div className="flex h-[calc(100vh-80px)]">
        <Game />
        <div className="flex justify-end items-center h-full">
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
