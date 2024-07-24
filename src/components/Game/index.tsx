import React, { useState } from "react";
import useConfig, { Config } from "../../useQuery/useConfig";
import { claimContractAddress, plawarContractAddress } from "../../constant";
import Timer from "./Timer";
import useGetNotRound from "../../useQuery/useGetNowRound";
import useGetTeamAmount from "../../useQuery/useGetTeamAmount";
import { WalletStatus, useWallet } from "@xpla/wallet-provider";
import useGetUserAmount from "../../useQuery/useGetUserAmount";
import useGetTeamAddress from "../../useQuery/useGetTeamAddress";
import useGetParticipateRound from "../../useQuery/useGetPariticpateRound";
import useGetClaimedRound from "../../useQuery/useGetClaimedRound";
import getWarTime from "../../util/getTimer";
import ParticipateForm from "./ParticipateForm";

const Game = () => {
  const { data: config } = useConfig();
  const { data: nowRound } = useGetNotRound();
  const { data: claimedRound } = useGetClaimedRound();
  const { status, wallets } = useWallet();

  return <div className="flex flex-1 flex-col">
    게임화면
    {
      config && <GameInfo config={config} />
    }
    {
      nowRound && <RoundInfo round={nowRound} />
    }
    {
      status === WalletStatus.WALLET_CONNECTED && wallets.length > 0 && nowRound &&
      <UserParticipateInfo address={wallets[0].xplaAddress} round={nowRound} />
    }
    {
      claimedRound && <div>
        클레임한 라운드 : [{claimedRound.toString()}]
      </div>
    }
{
  config && 
    <ParticipateForm />
}
  </div>
}

export default Game;

const GameInfo = ({ config }: { config: Config }) => {
  const warTime = getWarTime(config.war_min, config.truce_min, config.start_time);
  const [nowWar, setNowWar] = useState(warTime < config.war_min * 60);

  return <div>
    게임정보
    <br />전쟁시간 : {config.war_min}
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
    <br />게임 컨트랙트 주소 : {plawarContractAddress}
    <br />claim 컨트랙트 주소 : {claimContractAddress}
  </div>
}

const RoundInfo = ({ round }: { round: number }) => {
  const { data: teamAmount } = useGetTeamAmount(round);
  const { data: redTeamParticipants } = useGetTeamAddress(round, "red");
  const { data: blueTeamParticipants } = useGetTeamAddress(round, "blue");

  return <>
    <br />현재라운드 : {round}
    {
      teamAmount && <>
        <br />
        red팀 amount : {teamAmount.red}
        <br />
        blue팀 amount {teamAmount.blue}
        <br />
      </>
    }
    {
      redTeamParticipants && <>
        red팀 참가자수 :{redTeamParticipants.length}
        <br />
        참가자 :
        {
          redTeamParticipants.map((redTeam) => {
            return <div key={redTeam.address}>
              address : {redTeam.address} <br />
              amount : {redTeam.amount}<br />
            </div>
          })
        }
        <br />
      </>
    }
    {
      blueTeamParticipants && <>
        blue팀 참가자수 :{blueTeamParticipants.length}
        <br />
        참가자 :

        {
          blueTeamParticipants.map((blueTeam) => {
            return <div key={blueTeam.address}>
              address : {blueTeam.address} <br />
              amount : {blueTeam.amount}<br />
            </div>
          })
        }
        <br />
      </>
    }
  </>
}

const UserParticipateInfo = ({ address, round }: { address: string; round: number; }) => {
  const { data: userAmount } = useGetUserAmount(round, address);
  const { data: participatedRound } = useGetParticipateRound(address);
  return <> {
    userAmount && <>
      myaddress : {address}<br />
      team : {userAmount.team} <br />
      amount : {userAmount.amount}
      <br />
    </>
  }
    {
      participatedRound && <div>
        참가한 라운드: [{participatedRound.toString()}]
      </div>
    }
  </>
}