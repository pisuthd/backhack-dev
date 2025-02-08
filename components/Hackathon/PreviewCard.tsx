import { ArrowRight } from "react-feather"
import Link from "next/link"
import { secondsToDDHHMMSS, slugify } from "@/helpers"
import { useState, useEffect } from "react"

const PreviewCard = ({
    index,
    item
}: any) => {

    const [totalTeams, setTotalTeams] = useState<number>(0)
    const [totalBets, setTotalBets] = useState<number>(0)

    let countdown = "Ended"

    if (item && item.endDate) {
        const expiredDate = new Date(item.endDate)
        const diffTime = expiredDate.valueOf() - (new Date()).valueOf()
        const totals = Math.floor(diffTime / 1000)
        const { days, hours, minutes, seconds }: any = secondsToDDHHMMSS(totals)

        if (days > 0) {
            countdown = `Ends in ${days}d`
        } else {
            countdown = `Ends in ${hours}h`
        }
    }

    useEffect(() => {

        if (item) {

            (async () => {
                const teams = await item.teams()
                setTotalTeams(teams.data.length)

                const positions = await item.positions()
                const totalBets = positions.data.reduce((result: any, item: any) => {
                    result = result + Number(item.betAmount)
                    return result
                }, 0)
                setTotalBets(totalBets)

            })()

        }

    }, [item])

    return (
        <Link key={index} href={`/hackathon/${slugify(item.title)}`} className="bg-gray-900 h-[220px] rounded-xl group cursor-pointer shadow-lg hover:shadow-xl transition  border border-transparent hover:border-purple-500 overflow-hidden">
            <div className="grid grid-cols-5 h-full">
                <div className="col-span-2 p-6">
                    <img src={item.image} alt="Hackathon Image" className="h-full w-auto rounded-lg" />
                </div>
                <div className="col-span-3 p-6 pl-0 text-left flex flex-col">
                    <h3 className="text-xl font-semibold text-purple-400">{item.title}</h3>
                    <p className="text-gray-300 mt-2">{item.description}</p>
                    <div className="flex space-x-4">
                        <p className="text-gray-400 mt-2">📅 {countdown}</p>
                        <p className="text-gray-400 mt-2">🔥 {totalTeams} Teams</p>
                        <p className="text-gray-400 mt-2">⚡ {totalBets} SUI Bets</p>
                    </div>

                    <div className="mt-auto flex  text-secondary">
                        <div className="duration-300 ml-auto text-purple-400 group-hover:translate-x-2 rtl:rotate-180 rtl:group-hover:-translate-x-2">
                            <ArrowRight />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default PreviewCard