"use client"


import { useContext, useEffect, useState } from "react"
import Overview from "./Overview"
import PrizeTiers from "./PrizeTiers"
import TopTeams from "./TopTeams"
import { DatabaseContext } from "@/contexts/database"
import Wallet from "./Wallet"
import AllTeams from "./AllTeams"
import { slugify } from "@/helpers"
import { MarketContext } from "@/contexts/market"

interface IHackathonDetails {
    slug: string
}


const HackathonDetails = ({ slug }: IHackathonDetails) => {

    const { getHackathon }: any = useContext(MarketContext)

    const [onchainData, setData] = useState<any>()
    const [positions, setPositions] = useState<any[]>([])
    const [teams, setTeams] = useState([])

    const { hackathons, getPositions }: any = useContext(DatabaseContext)

    const hackathon = hackathons.reduce((result: any, item: any) => {
        if (slug === slugify(item.title)) {
            result = item
        }
        return result
    }, undefined)

    useEffect(() => {
        hackathon && getHackathon(Number(hackathon.onchainId)).then(setData)
    }, [hackathon])

    useEffect(() => {
        (async () => {
            const result = await hackathon.teams()
            setTeams(result.data)
        })()
    }, [hackathon])

    useEffect(() => {
        if (hackathon) {
            getPositions(hackathon.id).then(setPositions)
        }
    }, [hackathon])

    return (
        <div className="flex flex-col w-full justify-center pt-24 px-4 text-gray-300">
            {hackathon && (
                <div className="w-full max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-5 gap-3">


                    <div className="col-span-3 flex flex-col ">
                        <Overview
                            hackathon={hackathon}
                            positions={positions}
                        />
                        <Wallet
                            positions={positions}
                            teams={teams}
                        />
                    </div>

                    <div className="col-span-2">
                        <PrizeTiers
                            hackathon={hackathon}
                            onchainData={onchainData}
                        />
                        <TopTeams 
                            teams={teams}
                            positions={positions}
                        />
                    </div>
                    <div className="col-span-5">
                        <AllTeams
                            hackathon={hackathon}
                            teams={teams}
                            positions={positions}
                        />
                    </div>




                </div>
            )

            }


        </div>
    )
}

export default HackathonDetails