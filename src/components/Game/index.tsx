import React, { useState } from "react";
import useConfig, { Config } from "../useQuery/useConfig";
import { claimContractAddress, plawarContractAddress } from "../../constant";
import getTimer from "../../util/getTimer";
import Timer from "../Timer";

const Game = () => {
  const { data: config } = useConfig();

  return <div className="flex flex-1">
    게임화면
    {
      config && <GameInfo config={config} />
    }
    {/* {
              <br />현재라운드 :
              <br />red팀 amount
              <br />blue팀 amount
     } */}
  </div>
}

export default Game;

const GameInfo = ({ config }: { config: Config }) => {
  const secRemainder = getTimer(config.war_min, config.truce_min, config.start_time);
  const [nowWar, setNowWar] = useState(secRemainder < config.war_min * 60);
  
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
            seconds={config.war_min * 60 - secRemainder} 
          />
        </div>
        :
        <div>
          휴전시간 끝나는 타이머
          <Timer
            key={'truce'}
            nowWar={nowWar}
            setNowWar={setNowWar}
            seconds={(config.war_min + config.truce_min) * 60 - secRemainder}
          />
        </div>
    }
    <br />게임 컨트랙트 주소 : {plawarContractAddress}
    <br />claim 컨트랙트 주소 : {claimContractAddress}
  </div>

}