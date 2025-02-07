
import AddNewTeamModal from "@/modals/addNewTeam"
import { useEffect, useState } from "react"

enum MODAL {
    NONE,
    ADD_NEW_TEAM,
    REVIEW
}

const AllTeams = ({ hackathon }: any) => {

    const [modal, setModal] = useState<MODAL>(MODAL.NONE)

    const [teams, setTeams] = useState([])

    useEffect(() => {

        (async () => {
            const { data } = await hackathon.teams()
            setTeams(data)
        })()

    }, [hackathon])

    return (
        <>

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
                            { hackathon.urls.length === 0 && <p>Not available</p>}
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
                    }).map((team: any, index: number) => (
                        <div key={index} className="bg-gray-900  p-5 rounded-lg shadow-lg">
                            <div className="flex justify-between">
                                <h2 className="text-xl font-semibold">{team.name}</h2>
                                <span className="text-purple-400 font-bold my-auto">Scores: 40%</span>
                            </div>

                            <p className="text-gray-500 line-clamp-2 my-1">{team.description}</p>
                            <div className="mt-3 flex justify-between">
                                <span className="text-purple-400 font-bold my-auto">🎲 10 SUI</span>
                                <span className="text-purple-400 font-bold my-auto">Reviews (3)</span>
                                <button className="bg-purple-600 cursor-pointer text-white px-4 my-auto py-2 rounded-lg hover:bg-purple-500">Bet Now</button>
                            </div>
                        </div>
                    ))}

                    {/* <div className="bg-gray-900  p-5 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold">⚡ ChainMasters</h2>
                    <p className="text-gray-500">Members: Dave, Eve, Frank</p>
                    <div className="mt-3 flex justify-between">
                        <span className="text-indigo-600 font-bold">Odds: 3.2x</span>
                        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">Bet Now</button>
                    </div>
                </div> */}
                </div>

            </div>

            <div className="h-[60px]"></div>

        </>
    )
}

export default AllTeams