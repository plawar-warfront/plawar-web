import { useWallet } from "@xpla/wallet-provider";
import React, { useState } from "react";
import useUserParticipateRoundInfo, { UserParticipateRoundInfo , UserParticipateRoundInfoAPIResponse} from "../../../useQuery/lcd/useUserPariticpateRoundInfo";
import clsx from "clsx";
import axplaToXpla from "../../../util/axplaToXpla";
import { UserClaimData } from "../../../useQuery/lcd/useGetUserClaimStageInfo";
import useGetUserClaimStageInfo from "../../../useQuery/lcd/useGetUserClaimStageInfo";
import useUserClaim from "../../../useMutation/useUserClaim";
import useGetRoundListInfoFromAPI from "../../../useQuery/serverapi/useGetRoundListInfoFromAPI";
import { CircularProgress } from "@mui/material";
import ReactPaginate from "react-paginate";
import { RoundInfo } from "../../../useQuery/serverapi/useGetRoundInfoFromAPI";

const Claim = () => {
    const { wallets } = useWallet();
    const [page, setPage] = useState(0);
    const itemsPerPage = 10;

    const { data: userParticipateRoundInfo } = useUserParticipateRoundInfo(wallets[0].xplaAddress, page * itemsPerPage);

    return <div className="flex flex-1 flex-col w-full items-center">
        {
            userParticipateRoundInfo ? 
            <RoundPaginatedItems 
            address={wallets[0].xplaAddress}
            items={userParticipateRoundInfo}
            page={page}
            setPage={setPage}
            itemsPerPage={itemsPerPage}
            />
            :
            <CircularProgress size={12} />
           
        }
        
    </div>
}

export default Claim;

const RoundPaginatedItems = ({ address, items, page, setPage, itemsPerPage = 10} : {address: string, items: UserParticipateRoundInfoAPIResponse; page : number; setPage : React.Dispatch<React.SetStateAction<number>>; itemsPerPage? : number; }) => {
    const rounds = items.data.map((r) => r.round).join(',');
    const { data : roundlistinfo} = useGetRoundListInfoFromAPI(rounds);

    const pageCount = Math.ceil(items.total / itemsPerPage);
    const handlePageClick = (event:  { selected: number }) => {
      setPage(event.selected);
    };
  
    return (
        <div className="flex flex-col justify-between items-center min-h-[600px]">
            {
                roundlistinfo ?
                    <AllRoundInfo address={address} userParticipateRoundInfo={items.data} roundlistinfo={roundlistinfo} />
                    :
                    <CircularProgress size={12} />
            }
            <ReactPaginate
                activeClassName="text-[#00B1FF]"
                previousClassName="border rounded p-2"
                nextClassName="border rounded p-2"
                pageClassName="border rounded p-2"
                className="flex gap-2"
                breakLabel="..."
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                forcePage={page}
                previousLabel="< prev"
                renderOnZeroPageCount={null}
            />
        </div>
    );
}


const AllRoundInfo = ({ address, userParticipateRoundInfo, roundlistinfo }: {address:string; userParticipateRoundInfo: UserParticipateRoundInfo[]; roundlistinfo: RoundInfo[]}) => {
    const stages = roundlistinfo.map((round) => round.claimStage).filter((stage) => stage !== undefined && stage > 0) as number[] ;
    const { data: claimStagesInfo } = useGetUserClaimStageInfo(address, stages);


    const [requestError, setRequestError] = useState<string | null>(null);
    const [txhash, setTxhash] = useState<string | null>(null);

    return <div>
        {claimStagesInfo ?
            userParticipateRoundInfo.map((participatesRound, index) => {
                const roundinfo = roundlistinfo.filter((round) => round.round === participatesRound.round);
                const stageinfo = claimStagesInfo.filter((stage) => stage.stage === roundinfo[0].claimStage);

                return <OneRoundInfo
                    key={`${participatesRound.round}round`}
                    participatesRound={participatesRound}
                    roundinfo={roundinfo[0]}
                    nowRound={roundinfo.length <= 0}
                    stages={stages}
                    stageinfo = {stageinfo.length > 0 ? stageinfo[0] : undefined}
                    setRequestError={setRequestError}
                    setTxhash={setTxhash}
                />

            })
            : <CircularProgress size={12} />
        }
        <div className="max-w-[600px] ">
            {
                txhash && <a
                    href={`https://explorer.xpla.io/testnet/tx/${txhash}`}
                    target="_blank"
                    rel="noreferrer noopener"
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
    </div>
}

const OneRoundInfo = ({ 
    participatesRound, 
    roundinfo, 
    nowRound, 
    stages,
    stageinfo,
    setRequestError,
    setTxhash
}: { 
    participatesRound: UserParticipateRoundInfo; 
    roundinfo: RoundInfo; 
    nowRound : boolean; 
    stages: number[];
    stageinfo: UserClaimData | undefined;
    setRequestError : React.Dispatch<React.SetStateAction<string | null>>;
    setTxhash : React.Dispatch<React.SetStateAction<string | null>>;
}) => {
    const { mutateAsync: userClaim } = useUserClaim();

    const alreadyClaim = stageinfo ? (stageinfo.amounts.claimable === '0') : false;
    const gameResult = nowRound ? "NOWROUND" : (roundinfo.winresult === "draw" ? "DRAW" : roundinfo.winresult === participatesRound.team ? "WIN" : "LOSE");

    return  <div className="flex items-center gap-2 ">
        <p>Round: {participatesRound.round} -
            State: {gameResult} /
            Team : {participatesRound.team} /
            Participate Amount : {axplaToXpla(participatesRound.amount)} XPLA /
            Prize Amount: {axplaToXpla('0')} XPLA
           {alreadyClaim &&  <span>(alreay claimed!)</span>}
        </p>
        <button
            className={clsx("mt-2 px-4 py-2  text-white rounded  transition duration-200",
                ((gameResult === "WIN" || gameResult === "DRAW") && !alreadyClaim)
                    ?
                    (participatesRound.team === "red" ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600")
                    : "hover:cursor-not-allowed bg-gray-500 opacity-50",
            )}
             disabled={!(gameResult === "WIN" || gameResult === "DRAW") || alreadyClaim}
             onClick={async () => {
                 try {
                     if (stageinfo && stageinfo.stage !== -1) {
                         const res = await userClaim({
                             stage: stageinfo.stage,
                             stages
                         })
                         if (res) {
                             setTxhash(res.txhash);
                             setRequestError(null);
                         } else {
                             throw new Error("There is no txhash.");
                         }
                     } else {
                        throw Error("Stage info Error");
                     }

                 } catch (e) {
                     setRequestError(
                         `${e instanceof Error ? e.message : String(e)}`
                     );
                     setTxhash(null);
                 }
             }}
             >
             Get Reward
         </button>
     </div>
}

