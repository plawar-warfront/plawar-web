import React, { useState } from "react";
import useConfig, { Config } from "../../useQuery/lcd/useConfig";
import { claimContractAddress, plawarContractAddress } from "../../constant";
import { WalletStatus, useWallet } from "@xpla/wallet-provider";
import axplaToXpla from "../../util/axplaToXpla";
import { truncate } from "@xpla.kitchen/utils";
import useGetNowContractInfoFromAPI, { NowGameInfo } from "../../useQuery/serverapi/useGetNowContractInfoFromAPI";
import useUserParticipateRoundInfo from "../../useQuery/lcd/useUserPariticpateRoundInfo";
import useLatestBlock from "../../useQuery/lcd/useLatestBlock";

const GameInfo = () => {
  const { data: config } = useConfig();
  const { data: nowGameInfo } = useGetNowContractInfoFromAPI();
  const { status, wallets } = useWallet();
  const { data : latestBlock } = useLatestBlock();

  return <div className="flex flex-1 flex-col justify-between">
    <div>
      게임정보 :
      <br />
      게임 컨트랙트 주소 : {plawarContractAddress}
      <br />
      claim 컨트랙트 주소 : {claimContractAddress}
      <br/> 
      현재 최신 블록 : {latestBlock}
    
    // 이거 now_truce 값으로 설정해주기 (gameinfodetail부분 설정하는거!)
      {
        config && latestBlock&& <GameInfoDetail config={config} latestBlock={parseInt(latestBlock, 10)} />
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

export default GameInfo;

const GameInfoDetail = ({ config, latestBlock }: { config: Config, latestBlock : number }) => {
  const blockinterval = latestBlock - config.startblockheight;
  const roundblocknum = config.warblocknum + config.truceblocknum
  const remainder = blockinterval % roundblocknum;
  const quot = Math.floor(blockinterval / roundblocknum);
  const nowWar = remainder < config.warblocknum;

  return <div>
    게임시작블록: {config.startblockheight}
    <br />
    전쟁블록: {config.warblocknum} (휴전 직전 block에는 참가할 수 없음.)
    <br />휴전블록 개수 : {config.truceblocknum}
    {
      nowWar ?
        <div>
          휴전까지 남은 블록 : {(quot) * roundblocknum  + config.warblocknum - blockinterval }
        </div>
        :
        <div>
          전쟁까지 남은 블록 : {(quot+1) * roundblocknum - blockinterval }
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

        blue팀 참가자수 :{nowGameInfo.recent_blue_participants.length}
        <br />
        blue팀 참가자 :

        [{
          nowGameInfo.recent_blue_participants.map((blueTeam) => {
            return <div key={blueTeam[0]}>
              address : {truncate(blueTeam[0], [5, 4])}, amount : {axplaToXpla(blueTeam[1])} XPLA<br />
            </div>
          })
        }]
      </div>
      <div className="text-red-400">

        red팀 amount : {axplaToXpla(nowGameInfo.red_team_amount)} <br />

        red팀 참가자수 :{nowGameInfo.recent_red_participants.length}
        <br />
        red팀 참가자 :
        [{
          nowGameInfo.recent_red_participants.map((redTeam) => {
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
          UserParticipateRoundInfo.data.map((c) => {
            return <div key={`${c.round}round`}>
              {c.round} 라운드 - team : {c.team}, amount : {axplaToXpla(c.amount)}
            </div>
          })
        }]
      </div>
    }
  </>
}