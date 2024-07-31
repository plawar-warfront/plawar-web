import React from "react";
import useConfig from "../../../useQuery/useConfig";
import { WalletStatus, useWallet } from "@xpla/wallet-provider";
import ParticipateForm from "../ParticipateForm";

const GameScreen = () => {
    const { data: config } = useConfig();
    const { status, wallets } = useWallet();
    return <div className="flex flex-1 flex-col justify-between ml-5">
        <div className="flex flex-col flex-1  justify-center">

            <div className="aspect-video border border-1 border-black" >
                <iframe
                    src="http://localhost:5641/"
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    title="Example Site"
                    allowFullScreen
                />
            </div>
        </div>
        {
            config && <ParticipateForm config={config}
                address={status === WalletStatus.WALLET_CONNECTED && wallets.length > 0 ? wallets[0].xplaAddress : undefined}
            />
        }
    </div>
}

export default GameScreen