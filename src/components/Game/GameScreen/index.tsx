import React from "react";
import useConfig from "../../../useQuery/lcd/useConfig";
import { WalletStatus, useWallet } from "@xpla/wallet-provider";
import ParticipateForm from "../ParticipateForm";
import useGetNowContractInfoFromAPI, { NowGameInfo } from "../../../useQuery/serverapi/useGetNowContractInfoFromAPI";
import GameInfo from "../../GameInfo";
import NavigateSubtitle from "./NavigateSubtitle";
import { CircularProgress } from "@mui/material";
import SetSubtitleForm from "../../SubtitlePage/SetSubtitleForm";
import SubtitleCandidate from "../../SubtitlePage/SubtitleCandidate";
import useGetGamestateFromAPI from "../../../useQuery/serverapi/useGetGamestateFromAPI";
import useGetRoundInfoFromAPI from "../../../useQuery/serverapi/useGetRoundInfoFromAPI";
import clsx from "clsx";
import axplaToXpla from "../../../util/axplaToXpla";
import OptionSelector from "../../OptionSelector";
import useShowGameType from '../../../zustand/useShowGameType';
import UnityBuild from "./UnityBuild";

const GameScreen = () => {
    const { data: config } = useConfig();
    const { status, wallets } = useWallet();
    const { data: nowGameInfo } = useGetNowContractInfoFromAPI();
    const { data: gamestate } = useGetGamestateFromAPI();

    const { showGameType } = useShowGameType();


    if (!nowGameInfo) return <CircularProgress />
    return <>
        <div className={clsx("flex flex-1 flex-col justify-between p-4",
            (showGameType === "auto" ? (nowGameInfo.now_truce ? "block" : "hidden") : (showGameType === "game"
                ? "hidden" : "block")),
        )}>
            <div>
                <OptionSelector />

                <span className="text-[30px]">
                    {nowGameInfo.now_truce ? "휴전중" : "전쟁중"}
                </span>
                <br />
                <br />
                <GameInfo />
                <br />
                <br />
                <Roundinfo nowGameInfo={nowGameInfo} />
                <br />
                <br />
                <div>
                    Subtitle은 Claim 될때 바뀜.
                    만약 게임에 아무도 참여하지 않으면, Claim tx가 생성되지 않으므로 Subtitle도 변화되지 않음.
                </div>
                <br />
                <br />
                <div>
                    다음 Subtitle : {nowGameInfo.now_subtitle.blue} vs {nowGameInfo.now_subtitle.red} -  {nowGameInfo.now_subtitle.user_address === "" ? "Default Setting" : nowGameInfo.now_subtitle.user_address} / {axplaToXpla(nowGameInfo.now_subtitle.amount)} XPLA


                </div>
                <div className="flex">
                    <SubtitleCandidate subtitles={nowGameInfo.subtitles} />
                    <SetSubtitleForm />
                </div>
            </div>
        </div> <div className={clsx("flex flex-1 flex-col justify-between p-4", (showGameType === "auto" ? (nowGameInfo.now_truce ? "hidden" : "block") : (showGameType === "game"
            ? "block" : "hidden")))}>
            <OptionSelector />
현재 라운드 : {nowGameInfo.nowround}
            <NavigateSubtitle nowSubtitle={nowGameInfo.now_subtitle} />
            <UnityBuild />
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