

const TopTeams = () => {
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
                    <tr className="border-b">
                        <td className="py-2 px-4">🚀 MoonBuilders</td>
                        <td className="py-2 px-4">120 SUI</td>
                        <td className="py-2 px-4 font-bold text-indigo-600">4.5x</td>
                    </tr>
                    <tr className="border-b">
                        <td className="py-2 px-4">⚡ ChainMasters</td>
                        <td className="py-2 px-4">90 SUI</td>
                        <td className="py-2 px-4 font-bold text-indigo-600">3.2x</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default TopTeams