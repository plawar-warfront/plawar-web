import Connect from "../Connect";
import "../../App.css";
import { WalletStatus, useWallet } from "@xpla/wallet-provider";
import Header from "../Header";
import SubtitleCandidate from "./SubtitleCandidate";
import SetSubtitleForm from "./SetSubtitleForm";
import useGetNowContractInfoFromAPI from "../../useQuery/serverapi/useGetNowContractInfoFromAPI";

function SubtitlePage() {
    const { data: nowGameInfo } = useGetNowContractInfoFromAPI();
    const { status, wallets } = useWallet();
    return (
        <div className="App min-h-screen ">
            <Header />
            <div className="flex h-[calc(100vh-80px)]">
                {status === WalletStatus.WALLET_CONNECTED && wallets.length > 0 ?
                   <> {
                    nowGameInfo &&
                <div className="flex">
                    <SubtitleCandidate subtitles={nowGameInfo.subtitles} />
                    <SetSubtitleForm />
                </div>
}</>
                :
                <div >
                    Please Connect Wallet!
                </div>
                }
            </div>
        </div>
    );
}

export default SubtitlePage;
