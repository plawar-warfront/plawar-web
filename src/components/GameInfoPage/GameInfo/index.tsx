import React, { useState } from "react";
import useConfig, { Config } from "../../../useQuery/lcd/useConfig";
import { claimContractAddress, plawarContractAddress } from "../../../constant";
import Timer from "../../Game/Timer";
import { WalletStatus, useWallet } from "@xpla/wallet-provider";
import getWarTime from "../../../util/getWarTime";
import ParticipateForm from "../../Game/ParticipateForm";
import axplaToXpla from "../../../util/axplaToXpla";
import { truncate } from "@xpla.kitchen/utils";
import useGetNowContractInfoFromAPI, { NowGameInfo } from "../../../useQuery/serverapi/useGetNowContractInfoFromAPI";
import useUserParticipateRoundInfo from "../../../useQuery/lcd/useUserPariticpateRoundInfo";
import GameScreen from "../../Game/GameScreen";

const Game = () => {
  const { data: config } = useConfig();
  const { data: nowGameInfo } = useGetNowContractInfoFromAPI();
  const { status, wallets } = useWallet();

  return <div className="flex flex-1 flex-col justify-between">
    <div>
      게임정보 :
      <br />
      게임 컨트랙트 주소 : {plawarContractAddress}
      <br />
      claim 컨트랙트 주소 : {claimContractAddress}
      {
        config && <GameInfo config={config} />
      }
      ---<br />
      {
        nowGameInfo && <div>
          <div>
            게임에서 Vesting Register된 라운드 : [{nowGameInfo.claimed_round.toString()}]
          </div>
          ---<br />
          내 정보 : <br />
          {
            status === WalletStatus.WALLET_CONNECTED && wallets.length > 0 &&
            <UserParticipateInfo address={wallets[0].xplaAddress} />
          }
          ---<br />
          <RoundInfo nowGameInfo={nowGameInfo} />
        </div>
      }
    </div>


  </div>
}

export default Game;

const GameInfo = ({ config }: { config: Config }) => {
  const warTime = getWarTime(config.war_min, config.truce_min, config.start_time);
  const [nowWar, setNowWar] = useState(warTime < config.war_min * 60);

  return <div>
    게임시작시간(UTC): {config.start_time}<br />
    전쟁시간 : {config.war_min}
    <br />휴전시간 : {config.truce_min}
    {
      nowWar ?
        <div>
          전쟁시간 끝나는 타이머
          <Timer
            key={'war'}
            nowWar={nowWar}
            setNowWar={setNowWar}
            seconds={config.war_min * 60 - warTime}
          />
        </div>
        :
        <div>
          휴전시간 끝나는 타이머
          <Timer
            key={'truce'}
            nowWar={nowWar}
            setNowWar={setNowWar}
            seconds={(config.war_min + config.truce_min) * 60 - warTime}
          />
        </div>
    }

  </div>
}

const RoundInfo = ({ nowGameInfo }: { nowGameInfo: NowGameInfo }) => {
  return <div className="flex flex-col justify-center items-center">
    <br />현재라운드 : {nowGameInfo.nowround}
    <br />
    <div className="flex gap-10">
      <div className="text-blue-400">

        blue팀 amount : {axplaToXpla(nowGameInfo.blue_team_amount)} <br />

        blue팀 참가자수 :{nowGameInfo.blue_participants.length}
        <br />
        blue팀 참가자 :

        [{
          nowGameInfo.blue_participants.map((blueTeam) => {
            return <div key={blueTeam[0]}>
              address : {truncate(blueTeam[0], [5, 4])}, amount : {axplaToXpla(blueTeam[1])} XPLA<br />
            </div>
          })
        }]
      </div>
      <div className="text-red-400">

        red팀 amount : {axplaToXpla(nowGameInfo.red_team_amount)} <br />

        red팀 참가자수 :{nowGameInfo.red_participants.length}
        <br />
        red팀 참가자 :
        [{
          nowGameInfo.red_participants.map((redTeam) => {
            return <div key={redTeam[0]}>
              address : {truncate(redTeam[0], [5, 4])}, amount : {axplaToXpla(redTeam[1])} XPLA<br />
            </div>
          })
        }]
      </div>
    </div>

  </div>
}

const UserParticipateInfo = ({ address }: { address: string; }) => {
  const { data: UserParticipateRoundInfo } = useUserParticipateRoundInfo(address);
  return <>

    myaddress : {truncate(address, [5, 4])}<br />
    {
      UserParticipateRoundInfo && <div>
        참가한 라운드 정보 : [{
          UserParticipateRoundInfo.map((c) => {
            return <div key={`${c.round}round`}>
              {c.round} 라운드 - team : {c.team}, amount : {axplaToXpla(c.amount)}, state : {c.state},
            </div>
          })
        }]
      </div>
    }
  </>
}