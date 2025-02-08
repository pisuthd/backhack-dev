import { useEffect, useState } from "react"
import BigNumber from "bignumber.js"

const PrizeTiers = ({ hackathon, onchainData }: any) => {

    const [prizes, setPrizes] = useState([])

    useEffect(() => {

        (async () => {
            const { data } = await hackathon.prizes()
            setPrizes(data)
        })()

    }, [hackathon])

    let totalBetsAmount = 0

    if (onchainData) {
        totalBetsAmount = Number(BigNumber(onchainData.totalBetsAmount).dividedBy(10 ** 9))
    }

    return (
        <div className="p-6   px-0 sm:px-2">
            <h3 className="text-2xl font-bold">🏆 Prize Tiers</h3>
            <table className="w-full mt-4">
                <thead>
                    <tr className="text-left  ">
                        <th className="py-2  ">Prize Tier</th>
                        <th className="py-2  ">Distribution</th>
                        <th className="py-2  ">Allocation</th>
                    </tr>
                </thead>
                <tbody>
                    {prizes.sort(function (a: any, b: any) {
                        return Number(a.onchainId) - Number(b.onchainId)
                    }).map((item: any, index: number) => {
                        const odds = `${(item.odds / 100).toFixed(0)}%`
                        const allocation = totalBetsAmount*(item.odds/10000)

                        return (
                            <tr key={index} className="border-b">
                                <td className="py-2  ">{item.title}</td>
                                <td className="py-2  ">{odds}</td>
                                <td className="py-2  font-bold text-purple-400">{allocation.toLocaleString()} SUI</td>
                            </tr>
                        )
                    })

                    }
                </tbody>
            </table>
        </div>
    )
}


export default PrizeTiers