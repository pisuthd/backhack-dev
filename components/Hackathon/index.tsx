"use client"

import HackathonList from "../Landing/HackathonList"
import AllHackathonList from "./AllHackathonList"

const Hackathon = () => {
    return (
        <div className="flex flex-col  w-full max-w-6xl mx-auto  justify-center pt-24 px-4 text-gray-300">
             <HackathonList />
            <AllHackathonList/> 
        </div>
    )
}

export default Hackathon