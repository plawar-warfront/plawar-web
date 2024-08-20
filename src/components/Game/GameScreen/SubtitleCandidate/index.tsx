import { Subtitle } from "../../../../useQuery/useGetNowContractInfoFromAPI"
import axplaToXpla from "../../../../util/axplaToXpla"

const SubtitleCandidate = ({ subtitles }: { subtitles: Subtitle[] }) => {
    return <div className="flex-1">
        Top 5 subtitle candidate : <br/>
        {
            subtitles.slice(0, 5).map((subtitle) => <div>
                {subtitle.user_address} ({axplaToXpla(subtitle.amount)} XPLA) :  {subtitle.blue} vs {subtitle.red}
            </div>)
        }
    </div>
}

export default SubtitleCandidate