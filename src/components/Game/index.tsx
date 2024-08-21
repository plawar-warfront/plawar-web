import { WalletStatus, useWallet } from "@xpla/wallet-provider";
import "../../App.css";
import Header from "../Header";
import GameScreen from "./GameScreen";
import Chat from "../Chat";

function Game() {
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

export default Game;
