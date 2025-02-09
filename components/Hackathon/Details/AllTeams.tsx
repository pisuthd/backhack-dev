
import { AccountContext } from "@/contexts/account"
import AddNewTeamModal from "@/modals/addNewTeam"
import { useCallback, useContext, useEffect, useState } from "react"
import BetModal from "@/modals/bet"
import FetchTeamsModal from "@/modals/fetchTeams"
import BaseModal from "@/modals/base"
import TeamInfoModal from "@/modals/teamInfo"
import ReviewTeamModal from "@/modals/reviewTeam"

enum MODAL {
    NONE,
    ADD_NEW_TEAM,
    FETCH_TEAMS,
    REVIEW,
    BET,
    INFO
}

const AllTeams = ({ hackathon, teams, positions }: any) => {

    const { isConnected }: any = useContext(AccountContext)

    const [modal, setModal] = useState<MODAL>(MODAL.NONE)

    const [currentTeam, setCurrentTeam] = useState<any>(undefined)

    const [prizes, setPrizes] = useState([])

    useEffect(() => {

        (async () => {
            const { data } = await hackathon.prizes()
            setPrizes(data)
        })()

    }, [hackathon])

    const onBet = useCallback(async (currentTeam: any) => {

        if (!isConnected) {
            alert("Please login to continue")
            return
        }

        setCurrentTeam(currentTeam)
        setModal(MODAL.BET)

    }, [isConnected])

    const onInfo = useCallback((currentTeam: any) => {
        setCurrentTeam(currentTeam)
        setModal(MODAL.INFO)
    }, [])

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

            <FetchTeamsModal
                visible={modal === MODAL.FETCH_TEAMS}
                close={() => setModal(MODAL.NONE)}
                hackathon={hackathon}
            />


            <TeamInfoModal
                visible={modal === MODAL.INFO}
                close={() => setModal(MODAL.NONE)}
                currentTeam={currentTeam}
            />

            <ReviewTeamModal
                visible={modal === MODAL.REVIEW}
                close={() => setModal(MODAL.NONE)}
                hackathon={hackathon}
                teams={teams}
                prizes={prizes}
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
                        <button onClick={() => setModal(MODAL.FETCH_TEAMS)} className="my-auto flex flex-row cursor-pointer  bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-6 rounded-lg transition">
                            Fetch Teams from Official Source
                        </button>
                        <button onClick={() => setModal(MODAL.ADD_NEW_TEAM)} className="my-auto flex flex-row cursor-pointer  bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-6 rounded-lg transition">
                            Add New Team
                        </button>
                        <button onClick={() => setModal(MODAL.REVIEW)} className="my-auto ml-auto flex flex-row cursor-pointer  bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-6 rounded-lg transition">
                            Review Team
                        </button>
                    </div>

                </div>
                <div className="grid grid-cols-3 gap-4 mt-5">


                    {teams.sort(function (a: any, b: any) {
                        return Number(b.onchainId) - Number(a.onchainId)
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
                                        <h2 className="text-xl font-semibold line-clamp-1">{team.name}</h2>
                                        {/* <span className="text-purple-400 font-bold my-auto">Scores: 40%</span> */}
                                    </div>

                                    <p onClick={() => onInfo(team)} className="text-gray-500 hover:underline cursor-pointer line-clamp-2 my-1">{team.description}</p>
                                    <div className="mt-3 flex justify-between">
                                        <span className="  font-bold my-auto">⚡ {totalBets.toLocaleString()} SUI</span>
                                        <ReviewsRow onInfo={onInfo} team={team} />
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

const ReviewsRow = ({ onInfo, team }: any) => {

    const [total, setTotal] = useState<number>(0)

    useEffect(() => {



        (async () => {
            const { data } = await team.comments() 
            setTotal(data.length)
        })()

    }, [team])

    return (
        <span
            onClick={() => {
                onInfo(team)
            }}
            className="text-purple-400 font-bold my-auto cursor-pointer hover:underline">
            { total ? <>Reviews ({total})</> : ""}
        </span>
    )
}

export default AllTeams