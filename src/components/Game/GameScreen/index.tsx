import React from "react";
import useConfig from "../../../useQuery/lcd/useConfig";
import { WalletStatus, useWallet } from "@xpla/wallet-provider";
import ParticipateForm from "../ParticipateForm";
import useGetNowContractInfoFromAPI, { NowGameInfo } from "../../../useQuery/serverapi/useGetNowContractInfoFromAPI";
import Game from "../../GameInfoPage";
import GameInfo from "../../GameInfoPage/GameInfo";
import NavigateSubtitle from "./NavigateSubtitle";
import { CircularProgress } from "@mui/material";
import SetSubtitleForm from "../../SubtitlePage/SetSubtitleForm";
import SubtitleCandidate from "../../SubtitlePage/SubtitleCandidate";
import useGetGamestateFromAPI from "../../../useQuery/serverapi/useGetGamestateFromAPI";
import useGetRoundInfoFromAPI from "../../../useQuery/serverapi/useGetRoundInfoFromAPI";
import clsx from "clsx";

const GameScreen = () => {
    const { data: config } = useConfig();
    const { status, wallets } = useWallet();
    const { data: nowGameInfo } = useGetNowContractInfoFromAPI();
    const { data: gamestate } = useGetGamestateFromAPI();

    if (!nowGameInfo) return <CircularProgress />
    return <>
        <div className={clsx({
            "block": nowGameInfo.now_truce,
            "hidden" : !nowGameInfo.now_truce

        }, "flex flex-1 flex-col justify-between p-4")}>
            <div>
                <span className="text-[30px]">
                    휴전중
                </span>
                <br />
                <br />
                <GameInfo />
                <br />
                <br />
                <div>
                    Next Subtitle will be ... (휴전이 되고 tx가 생성되면 바뀜...)
                    (아무도 게임에 참여하지 않았다면, subtitle이 바뀌지 않음. claim tx가 생성될 때 적용되기 때문.)
                    <NavigateSubtitle nowSubtitle={nowGameInfo.now_subtitle} />
                </div>
                <div className="flex">
                    <SubtitleCandidate subtitles={nowGameInfo.subtitles} />
                    <SetSubtitleForm />
                </div>
                <Roundinfo nowGameInfo={nowGameInfo} />
            </div>
        </div> <div className={clsx({
            "block": !nowGameInfo.now_truce,
            "hidden" : nowGameInfo.now_truce
        }, "flex flex-1 flex-col justify-between p-4")}>
            <NavigateSubtitle nowSubtitle={nowGameInfo.now_subtitle} />
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
            {
                gamestate && <>gamestate - warposition : {gamestate.warPosition} / blue 수: {gamestate.blueSoldierNum} / red 수 : {gamestate.redSoldierNum}</>
            }

        </div>
    </>
}

export default GameScreen

const Roundinfo = ({ nowGameInfo }: { nowGameInfo: NowGameInfo }) => {
    const { data: roundinfo } = useGetRoundInfoFromAPI(nowGameInfo.nowround);

    return <div>
        {
            roundinfo ? <>
                {roundinfo.round} Round 이긴 팀 : {roundinfo.winresult}
            </>
                :
                <CircularProgress />
        }
    </div>
}