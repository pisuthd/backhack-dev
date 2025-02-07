"use client"


import { useContext } from "react"
import Overview from "./Overview"
import PrizeTiers from "./PrizeTiers"
import TopTeams from "./TopTeams"
import { DatabaseContext } from "@/contexts/database"
import Wallet from "./Wallet"
import AllTeams from "./AllTeams"
import { slugify } from "@/helpers"

interface IHackathonDetails {
    slug: string
}


const HackathonDetails = ({ slug }: IHackathonDetails) => {

    const { hackathons }: any = useContext(DatabaseContext)

    const hackathon = hackathons.reduce((result: any, item: any) => {
        if (slug === slugify(item.title)) {
            result = item
        }
        return result
    }, undefined)

    return (
        <div className="flex flex-col w-full justify-center pt-24 px-4 text-gray-300">
            {hackathon && (
                <div className="w-full max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-5 gap-3">


                    <div className="col-span-3 flex flex-col ">
                        <Overview
                            hackathon={hackathon}
                        />
                        <Wallet />
                    </div>

                    <div className="col-span-2">
                        <PrizeTiers 
                            hackathon={hackathon}
                        />
                        <TopTeams />
                    </div>
                    <div className="col-span-5">
                        <AllTeams
                            hackathon={hackathon}
                        />
                    </div>

 


                </div>
            )

            }


        </div>
    )
}

export default HackathonDetails