import { WalletStatus, useWallet } from "@xpla/wallet-provider";
import Header from "../Header";
import GameInfo from "./GameInfo";

const GameInfoPage = () => {
  const { status, wallets } = useWallet();
  return (
      <div className="App min-h-screen ">
          <Header />
          <div className="flex h-[calc(100vh-80px)]">
              {status === WalletStatus.WALLET_CONNECTED && wallets.length > 0 ?
                  <GameInfo />
                  :
                  <div >
                      Please Connect Wallet!
                  </div>
              }
          </div>
      </div>
  );
}


export default GameInfoPage