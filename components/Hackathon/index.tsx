"use client"

import FeaturedList from "./FeaturedList"
import AllHackathonList from "./AllHackathonList"

const Hackathon = () => {
    return (
        <div className="flex flex-col  w-full   justify-center pt-24 px-4  text-gray-300">
            {/* <FeaturedList />  */}
            <div className="h-[40px]">

            </div>
            <AllHackathonList />
        </div>
    )
}

export default Hackathon