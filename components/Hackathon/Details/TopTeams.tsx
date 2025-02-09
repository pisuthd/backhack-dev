import { useEffect, useState } from "react"

const TopTeams = ({ teams, positions }: any) => {

    const teamsWithBets = teams.map((team: any) => {

        const totalBets = positions.reduce((result: any, item: any) => {
            if (item.predictedTeam === team.onchainId) {
                result = result + Number(item.betAmount)
            }
            return result
        }, 0)

        return {
            name: team.name,
            totalBets,
            comments: team.comments
        }
    })

    return (
        <div className="p-6 px-0 sm:px-2">
            <h3 className="text-2xl font-bold">🔥 Top Teams</h3>
            <table className="w-full mt-4">
                <thead>
                    <tr className="text-left  ">
                        <th className="py-2 px-4">Team</th>
                         <th className="py-2 px-4">Rates</th>
                        <th className="py-2 px-4">Total Bets</th> 
                    </tr>
                </thead>
                <tbody>
                    {teamsWithBets.sort((a: any, b: any) => b.totalBets - a.totalBets).map((team: any, index: number) => {

                        if (team.totalBets === 0) {
                            return
                        }

                        if (index > 4) {
                            return
                        }

                        return (
                            <TeamRow
                                index={index}
                                team={team}
                            />
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

const TeamRow = ({ index, team }: any) => {

    const [rate, setRate] = useState("Unrated")

    useEffect(() => {
        if (team) {
            (async () => {

                const { data } = await team.comments()

                if (data && data[0]) {

                    // Regex for percentages (XX%)
                    const regexPercentage = /(\d{1,3})%/;

                    // Regex for score format (XX/100)
                    const regexScore = /(\d{1,3})\/100/;

                    const matchPercentage = data[0].feedback.match(regexPercentage);
                    const matchScore = data[0].feedback.match(regexScore);

                    if (matchScore) { 
                        setRate(`${matchScore[0].split("/")[0]}%`)
                    } else if (matchPercentage) { 
                        setRate(matchPercentage[0])
                    } else {
                        console.log("No score found.");
                    }
                } else {

                }
            })()
        }
    }, [team])

    return (
        <tr key={index} className="border-b border-gray-200">
            <td className="py-2 px-4">{team.name}</td> 
            <td className="py-2 px-4   ">{rate}</td>
            <td className="py-2 px-4   font-bold">{(team.totalBets).toLocaleString()}{` SUI`}</td>
        </tr>
    )

}

export default TopTeams