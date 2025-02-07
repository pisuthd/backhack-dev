
import { secondsToDDHHMMSS, slugify } from "@/helpers"


const Overview = ({ hackathon }: any) => {

    let countdown = "Ended"

    if (hackathon && hackathon.endDate) {
        const expiredDate = new Date(hackathon.endDate)
        const diffTime = expiredDate.valueOf() - (new Date()).valueOf()
        const totals = Math.floor(diffTime / 1000)
        const { days, hours, minutes, seconds }: any = secondsToDDHHMMSS(totals)

        if (days > 0) {
            countdown = `Ends in ${days}d`
        } else {
            countdown = `Ends in ${hours}h`
        }
    }

    return (
        <div className="pt-6">
            <h3 className="text-3xl font-bold text-purple-400">
                {hackathon.title}
            </h3>
            <p className="mt-2  text-lg">
                {hackathon.description}
            </p> 
            <div className="mt-4 flex items-center space-x-4">
                {/* <span className="bg-gray-800 text-gray-300 px-4 py-2 rounded-lg">
                    🏆{` `}{hackathon.title}
                </span> */}
                <span className="bg-gray-800 text-gray-300 px-4 py-2 rounded-lg">📅{` `}{countdown}</span>
            </div>
        </div>
    )
}

export default Overview