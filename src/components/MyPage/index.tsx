import Connect from "../Connect";
import "../../App.css";
import { WalletStatus, useWallet } from "@xpla/wallet-provider";
import Header from "../Header";

function MyPage() {
    const { status, wallets } = useWallet();
    return (
        <div className="App min-h-screen ">
            <Header />
            <div className="flex h-[calc(100vh-80px)]">
                {status === WalletStatus.WALLET_CONNECTED && wallets.length > 0 ?
                    <div>
                        sdf
                    </div>
                    :
                    <div >
                        Please Connect Wallet!
                    </div>
                }
            </div>
        </div>
    );
}

export default MyPage;
