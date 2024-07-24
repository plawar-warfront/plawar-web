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
import getWarTime from "../../util/getWarTime";
import ParticipateForm from "./ParticipateForm";
import axplaToXpla from "../../util/axplaToXpla";
import { truncate } from "@xpla.kitchen/utils";

const Game = () => {
  const { data: config } = useConfig();
  const { data: nowRound } = useGetNotRound();
  const { data: claimedRound } = useGetClaimedRound();
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
        claimedRound && <div>
          게임에서 Vesting Register된 라운드 : [{claimedRound.toString()}]
        </div>
      }
      ---<br />

      내 정보 : <br />
      {
        status === WalletStatus.WALLET_CONNECTED && wallets.length > 0 && nowRound &&
        <UserParticipateInfo address={wallets[0].xplaAddress} round={nowRound} />
      }

      ---<br />
      {
        nowRound && <RoundInfo round={nowRound} />
      }
    </div>
    {
      config && <ParticipateForm config={config}
        address={status === WalletStatus.WALLET_CONNECTED && wallets.length > 0 ? wallets[0].xplaAddress : undefined}
      />
    }
  </div>
}

export default Game;

const GameInfo = ({ config }: { config: Config }) => {
  const warTime = getWarTime(config.war_min, config.truce_min, config.start_time);
  const [nowWar, setNowWar] = useState(warTime < config.war_min * 60);

  return <div>
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

const RoundInfo = ({ round }: { round: number }) => {
  const { data: teamAmount } = useGetTeamAmount(round);
  const { data: redTeamParticipants } = useGetTeamAddress(round, "red");
  const { data: blueTeamParticipants } = useGetTeamAddress(round, "blue");

  return <div className="flex flex-col justify-center items-center">
    <br />현재라운드 : {round}
    <br />
    <div className="flex gap-10">
      <div className="text-blue-400">

        {
          teamAmount && <>
            blue팀 amount : {axplaToXpla(teamAmount.blue)} <br />
          </>
        }
        {
          blueTeamParticipants && <>
            blue팀 참가자수 :{blueTeamParticipants.length}
            <br />
            blue팀 참가자 :

            [{
              blueTeamParticipants.map((blueTeam) => {
                return <div key={blueTeam.address}>
                  address : {truncate(blueTeam.address, [5, 4])}, amount : {axplaToXpla(blueTeam.amount)} XPLA<br />
                </div>
              })
            }]
            <br />
          </>
        }
      </div>
      <div className="text-red-400">

        {
          teamAmount && <>
            red팀 amount : {axplaToXpla(teamAmount.red)} <br />
          </>
        }
        {
          redTeamParticipants && <>
            red팀 참가자수 :{redTeamParticipants.length}
            <br />
            red팀 참가자 :
            [{
              redTeamParticipants.map((redTeam) => {
                return <div key={redTeam.address}>
                  address : {truncate(redTeam.address, [5, 4])}, amount : {axplaToXpla(redTeam.amount)} XPLA<br />
                </div>
              })
            }]
            <br />
          </>
        }
      </div>


    </div>
  </div>
}

const UserParticipateInfo = ({ address, round }: { address: string; round: number; }) => {
  const { data: userAmount } = useGetUserAmount(round, address);
  const { data: participatedRound } = useGetParticipateRound(address);
  return <>

    {
      userAmount && <>
        myaddress : {truncate(address, [5, 4])}<br />
        {
          participatedRound && <div>
            참가한 라운드: [{participatedRound.toString()}]
          </div>
        }
        <br />
        이번 라운드에서 참가한 정보 <br />
        team : {userAmount.team} <br />
        amount : {axplaToXpla(userAmount.amount)} XPLA
        <br />
      </>
    }
  </>
}