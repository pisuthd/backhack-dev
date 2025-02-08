

const TopTeams = ({ teams, positions }: any) => {

    const teamsWithBets = teams.map((team: any ) => {
        
        const totalBets = positions.reduce((result: any, item: any) => {
            if (item.predictedTeam === team.onchainId) {
                result = result + Number(item.betAmount)
            }
            return result
        }, 0)
        
        return {
            name: team.name,
            totalBets
        }
    })

    return (
        <div className="p-6 px-0 sm:px-2">
            <h3 className="text-2xl font-bold">🔥 Top Teams</h3>
            <table className="w-full mt-4">
                <thead>
                    <tr className="text-left  ">
                        <th className="py-2 px-4">Team</th>
                        <th className="py-2 px-4">Total Bets</th>
                        <th className="py-2 px-4">Odds</th>
                    </tr>
                </thead>
                <tbody>
                    { teamsWithBets.sort((a: any, b: any) => b.totalBets - a.totalBets).map((team: any, index: number) => {

                        if (team.totalBets === 0) {
                            return
                        }

                        if (index > 4) {
                            return
                        }

                        return (
                            <tr key={index} className="border-b border-gray-200">
                                <td className="py-2 px-4">{team.name}</td>
                                <td className="py-2 px-4">{(team.totalBets).toLocaleString()}{` SUI`}</td>
                                <td className="py-2 px-4">XXX</td>
                            </tr>
                        )
                    })} 
                </tbody>
            </table>
        </div>
    )
}

export default TopTeams