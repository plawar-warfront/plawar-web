import { useWallet } from "@xpla/wallet-provider";
import React, { useState } from "react";
import useUserParticipateRoundInfo, { UserParticipateRoundInfo } from "../../../useQuery/lcd/useUserPariticpateRoundInfo";
import clsx from "clsx";
import axplaToXpla from "../../../util/axplaToXpla";
import useGetUserCanClaimStage, { UserClaimData } from "../../../useQuery/lcd/useGetUserCanClaimStage";
import useUserClaim from "../../../useMutation/useUserClaim";

const Claim = () => {
    const { wallets } = useWallet();
    const { data: userParticipateRoundInfo } = useUserParticipateRoundInfo(wallets[0].xplaAddress);
    const { data: userCanClaimRound } = useGetUserCanClaimStage(wallets[0].xplaAddress);
    console.log(userParticipateRoundInfo, userCanClaimRound)

    return <div className="flex flex-1 flex-col w-full items-center">
        {userParticipateRoundInfo && userCanClaimRound && <UserRoundComponent userParticipateRoundInfo={userParticipateRoundInfo} userCanClaimRound={userCanClaimRound} />}
    </div>
}

export default Claim;

const UserRoundComponent = ({ userParticipateRoundInfo, userCanClaimRound }: { userParticipateRoundInfo: UserParticipateRoundInfo[]; userCanClaimRound: UserClaimData[] }) => {
    const winRoundInfo = userParticipateRoundInfo.filter((round) => (round.state === "WIN" || round.state === "DRAW"));
    const { mutateAsync: userClaim } = useUserClaim();

    const [requestError, setRequestError] = useState<string | null>(null);
    const [txhash, setTxhash] = useState<string | null>(null);
    
    return <>
        {
            userParticipateRoundInfo.map((roundinfo, index) => {
                const roundWinIndex = winRoundInfo.findIndex((e) => e.round === roundinfo.round);
                const prizeAmount = roundWinIndex === -1 ? '0' : userCanClaimRound[roundWinIndex].amounts.total;
                const alreadyClaim = roundWinIndex === -1 ? false : userCanClaimRound[roundWinIndex].amounts.claimable === '0';

                return <div key={`${roundinfo.round}round`} className="flex items-center gap-2 ">
                    <p>Round: {roundinfo.round} - State: {roundinfo.state}, Team : {roundinfo.team}, Participate Amount : {axplaToXpla(roundinfo.amount)} XPLA, Prize Amount: {axplaToXpla(prizeAmount)} XPLA {alreadyClaim && (<span>(alreay claimed!)</span>)}</p>
                    <button
                        className={clsx("mt-2 px-4 py-2  text-white rounded  transition duration-200",
                            ((roundinfo.state === "WIN" || roundinfo.state === "DRAW") && !alreadyClaim )? (roundinfo.team === "red" ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600") : "hover:cursor-not-allowed bg-gray-500 opacity-50",
                        )}
                        disabled={!(roundinfo.state === "WIN" || roundinfo.state === "DRAW") || alreadyClaim}
                        onClick={async () => {
                            try {
                                console.log(1);
                                const res = await userClaim({
                                    stage: userCanClaimRound[roundWinIndex].stage
                                })
                                if (res) {
                                    setTxhash(res.txhash);
                                    setRequestError(null);
                                } else {
                                    throw new Error("There is no txhash.");
                                }
                            } catch (e) {
                                setRequestError(
                                    `${e instanceof Error ? e.message : String(e)}`
                                );
                                setTxhash(null);
                            }
                        }}>
                        Get Reward
                    </button>
                </div>
            })
        }
        <div className="max-w-[600px] ">
            {
                txhash && <a
                    href={`https://explorer.xpla.io/testnet/tx/${txhash}`}
                    target="_blank"
                    className="text-[#00B1FF] overflow-hidden whitespace-nowrap text-ellipsis w-full max-w-[210px] inline-block"
                >
                    {txhash}
                </a>
            }
            {
                requestError && <span className="text-[#FF3C24] font-medium text-[15px] leading-[18px] ">
                    {requestError}
                </span>
            }
        </div>

    </>
}