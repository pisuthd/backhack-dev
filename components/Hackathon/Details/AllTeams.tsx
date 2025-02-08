
import { AccountContext } from "@/contexts/account"
import AddNewTeamModal from "@/modals/addNewTeam"
import { useCallback, useContext, useEffect, useState } from "react"
import BetModal from "@/modals/bet"

enum MODAL {
    NONE,
    ADD_NEW_TEAM,
    REVIEW,
    BET
}

const AllTeams = ({ hackathon, teams, positions }: any) => {

    const { isConnected }: any = useContext(AccountContext)

    const [modal, setModal] = useState<MODAL>(MODAL.NONE)

    const [currentTeam, setCurrentTeam] = useState(undefined)


    const onBet = useCallback(async (currentTeam: any) => {

        if (!isConnected) {
            alert("Please login to continue")
            return
        }

        setCurrentTeam(currentTeam)
        setModal(MODAL.BET)

    }, [isConnected])

    return (
        <>

            <BetModal
                visible={modal === MODAL.BET}
                close={() => setModal(MODAL.NONE)}
                currentTeam={currentTeam}
                currentHackathon={hackathon}
            />

            <AddNewTeamModal
                visible={modal === MODAL.ADD_NEW_TEAM}
                close={() => setModal(MODAL.NONE)}
                hackathon={hackathon}
            />

            <div className="p-6 mt-[20px] px-0">
                <h3 className="text-2xl font-bold  ">All Teams</h3>

                <div className="mt-3">
                    <div className="flex flex-row mb-4 text-lg">
                        <div className="pr-2">
                            <span className="font-bold mb-2">
                                Official Listings:
                            </span>
                        </div>
                        <div className="pl-2 flex flex-col">
                            {hackathon.urls.map((url: string, index: number) => {
                                return (
                                    <a href={url} target="_blank" className=" hover:underline" key={index}>
                                        {url}
                                    </a>
                                )
                            })}
                            {hackathon.urls.length === 0 && <p>Not available</p>}
                        </div>

                    </div>
                    <div className="  flex flex-row space-x-3">
                        <button onClick={() => setModal(MODAL.ADD_NEW_TEAM)} className="my-auto flex flex-row cursor-pointer  bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-6 rounded-lg transition">
                            Fetch Teams from Official Source
                        </button>
                        <button onClick={() => setModal(MODAL.ADD_NEW_TEAM)} className="my-auto flex flex-row cursor-pointer  bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-6 rounded-lg transition">
                            Add New Team
                        </button>
                        <button onClick={() => alert()} className="my-auto ml-auto flex flex-row cursor-pointer  bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-6 rounded-lg transition">
                            Review All
                        </button>
                    </div>

                </div>
                <div className="grid grid-cols-3 gap-4 mt-5">


                    {teams.sort(function (a: any, b: any) {
                        return Number(a.onchainId) - Number(b.onchainId)
                    }).map((team: any, index: number) => {

                        const totalBets = positions.reduce((result: any, item: any) => {
                            if (item.predictedTeam === team.onchainId) {
                                result = result + Number(item.betAmount)
                            }
                            return result
                        }, 0)

                        return (
                            (
                                <div key={index} className="bg-gray-900    p-5 rounded-lg shadow-lg">
                                    <div className="flex justify-between">
                                        <h2 className="text-xl font-semibold">{team.name}</h2>
                                        <span className="text-purple-400 font-bold my-auto">Scores: 40%</span>
                                    </div>

                                    <p className="text-gray-500 line-clamp-2 my-1">{team.description}</p>
                                    <div className="mt-3 flex justify-between">
                                        <span className="  font-bold my-auto">⚡ {totalBets.toLocaleString()} SUI</span>
                                        <span
                                            onClick={() => {
                                                onBet(team)
                                            }}
                                            className="text-purple-400 font-bold my-auto cursor-pointer hover:underline">
                                            Reviews (3)
                                        </span>
                                        <button
                                            className="bg-purple-600 cursor-pointer text-white px-4 my-auto py-2 rounded-lg hover:bg-purple-500"
                                            onClick={() => {
                                                onBet(team)
                                            }}
                                        >Bet Now</button>
                                    </div>
                                </div>
                            )
                        )
                    })}
                </div>

            </div>

            <div className="h-[60px]"></div>

        </>
    )
}

export default AllTeams