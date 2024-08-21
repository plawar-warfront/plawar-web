import { useNavigate } from "react-router-dom";
import { Subtitle } from "../../../../useQuery/serverapi/useGetNowContractInfoFromAPI"
import axplaToXpla from "../../../../util/axplaToXpla"
import clsx from "clsx";

const NavigateSubtitle = ({ nowSubtitle }: { nowSubtitle: Subtitle }) => {
    const navigate = useNavigate();
    return <div className="flex justify-center w-full items-center">
        <div className=" flex justify-between w-full max-w-[1496px] items-center">
            <div className="text-blue-500 text-[24px]">
                {nowSubtitle.blue}
            </div>
            <div>
                {nowSubtitle.user_address === "" ? "Default Setting" : nowSubtitle.user_address} / {axplaToXpla(nowSubtitle.amount)} XPLA

                <button 
                onClick={() => { navigate('/plawar-web/setsubtitle') }}
                className={clsx("ml-[10px] text-white font-bold py-2 px-2 rounded",
                    // !nowWar && "hover:cursor-not-allowed bg-opacity-50",
                    // nowWar && (team === 'red' ? 'hover:bg-red-700' : 'hover:bg-blue-700'),
                    'bg-green-500 hover:bg-green-700'
                )}>
                set your subtitle → 
                </button>
            </div>
            <div className="text-red-500 text-[24px]">
                {nowSubtitle.red}
            </div>
        </div>
    </div>
}

export default NavigateSubtitle