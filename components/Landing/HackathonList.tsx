import { DatabaseContext } from "@/contexts/database"
import { useContext } from "react"
import { ArrowRight } from "react-feather"


const HackathonList = () => {

    const { hackathons }: any = useContext(DatabaseContext)

    return (
        <section className="bg-gray-950 text-white py-12 text-center">
            <div className="max-w-4xl mx-auto mb-[40px]">
                <h2 className="text-4xl font-bold text-purple-400">
                    Featured Hackathons
                </h2>
            </div>

            <div className="grid max-w-screen-xl  mx-auto  grid-cols-1 sm:grid-cols-2 gap-6">

                {hackathons.map((item: any, index: number) => { 
                    return (
                        <div key={index} className="bg-gray-900   rounded-xl group cursor-pointer shadow-lg hover:shadow-xl transition  border border-transparent hover:border-purple-500 overflow-hidden">
                            <div className="grid grid-cols-5 h-full">
                                <div className="col-span-2 p-6">
                                    <img src={item.image} alt="Hackathon Image" className="h-full w-auto rounded-lg" />
                                </div>
                                <div className="col-span-3 p-6 text-left flex flex-col">
                                    <h3 className="text-xl font-semibold text-purple-400">{item.title}</h3>
                                    <p className="text-gray-400 mt-2">🏆 {item.prizePool} Prize Pool | 🗓 {item.period}</p>
                                    <p className="text-gray-300 mt-2">{item.description}</p>
                                    <div className="mt-auto flex  text-secondary">

                                        <div className="duration-300 ml-auto text-purple-400 group-hover:translate-x-2 rtl:rotate-180 rtl:group-hover:-translate-x-2">
                                            <ArrowRight />
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* <h3 className="text-xl font-semibold text-purple-400">{item.title}</h3>
                            <p className="text-gray-400 mt-2">🏆 {item.prizePool} Prize Pool | 🗓 {item.period}</p>
                            <p className="text-gray-300 mt-2">{item.description}</p>
                            <a href="#" className="mt-4 inline-block bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-lg transition">View Details</a> */}
                        </div>
                    )
                })

                }

            </div>

        </section>
    )
}

export default HackathonList