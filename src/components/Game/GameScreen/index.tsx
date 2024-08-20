import React from "react";
import useConfig from "../../../useQuery/useConfig";
import { WalletStatus, useWallet } from "@xpla/wallet-provider";
import ParticipateForm from "../ParticipateForm";
import useGetNowContractInfoFromAPI from "../../../useQuery/useGetNowContractInfoFromAPI";
import Game from "..";
import GameInfo from "../GameInfo";
import GameSubtitle from "./GameSubtitle";
import { CircularProgress } from "@mui/material";
import SetSubtitleForm from "./SetSubtitleForm";
import SubtitleCandidate from "./SubtitleCandidate";

const GameScreen = () => {
    const { data: config } = useConfig();
    const { status, wallets } = useWallet();
    const { data: nowGameInfo } = useGetNowContractInfoFromAPI();

    return <div className="flex flex-1 flex-col justify-between p-4">
        {
            nowGameInfo ? (nowGameInfo.now_truce ? <div>
                <span className="text-[30px]">
                    Truce time!
                </span>
                <br />
                <br />
                <GameInfo />
                <div>
                    Next Subtitle will be ... (휴전이 되고 tx가 생성되면 바뀜...)
                    (아무도 게임에 참여하지 않았다면, subtitle이 바뀌지 않음. claim tx가 생성될 때 적용되기 때문.)
                    <GameSubtitle nowSubtitle={nowGameInfo.now_subtitle} />
                </div>
                <div className="flex">
                    <SubtitleCandidate subtitles={nowGameInfo.subtitles} />
                    <SetSubtitleForm />
                </div>

            </div> :
                <>
                    <GameSubtitle nowSubtitle={nowGameInfo.now_subtitle} />
                    <iframe
                        src={`${process.env.PUBLIC_URL}/unitybuild/index.html`}
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        title="Example Site"
                        allowFullScreen
                    />
                    {
                        config && <ParticipateForm config={config}
                            address={status === WalletStatus.WALLET_CONNECTED && wallets.length > 0 ? wallets[0].xplaAddress : undefined}
                        />
                    }


                </>) : <CircularProgress />
        }
    </div>
}

export default GameScreen