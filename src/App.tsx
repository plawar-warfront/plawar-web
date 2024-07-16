import "./App.css";
import Connect from "./components/Connect";
import Chat from "./components/Chat";
import { WalletStatus, useWallet } from "@xpla/wallet-provider";

function App() {
  const { status, wallets } =
    useWallet();
  return (
    <div className="App min-h-screen">
      <header className="App-header">
        <div className="w-[1180px] flex justify-between font-sora-700 text-gradient md:text-[30px] text-[16px]">
          <span>PlaWar : WarFront</span>
          <Connect />
        </div>
      </header>
      <div className="flex justify-end items-center min-h-[calc(100vh-80px)]">
        {status === WalletStatus.WALLET_CONNECTED && wallets.length > 0 ?
          <Chat />
          :
          <div >
            Please Connect Wallet!
          </div>
        }
      </div>
    </div>
  );
}

export default App;
