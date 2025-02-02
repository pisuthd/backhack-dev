

const HackathonList = () => {

    const hackathons = [
        {
            name: "ETHGlobal Tokyo",
            description: "Join top builders in Tokyo for a weekend of innovation.",
            totalPrize: "$500K",
            period: "March 15-17, 2025"
        },
        {
            name: "Solana Hacker House NYC",
            description: "Build on Solana with experts and top developers.",
            totalPrize: "$300K",
            period: "April 10-12, 2025"
        }
    ]

    return (
        <section className="bg-gray-950 text-white py-12 text-center">
            <div className="max-w-4xl mx-auto mb-[40px]">
                <h2 className="text-4xl font-bold text-purple-400">
                    Featured Hackathons
                </h2>
                {/* <p className="mt-4 text-lg text-gray-300">
                    Simple steps to add more fun while participating in hackathons.
                </p> */}
            </div>

            <div className="grid max-w-screen-xl  mx-auto  grid-cols-1 sm:grid-cols-2 gap-6">
 

                { hackathons.map((item, index) => {
                    return (
                        <div key={index} className="bg-gray-900 p-6  rounded shadow-lg hover:shadow-xl transition">
                            <h3 className="text-xl font-semibold text-purple-400">{item.name}</h3>
                            <p className="text-gray-400 mt-2">🏆 {item.totalPrize} Prize Pool | 🗓 {item.period}</p>
                            <p className="text-gray-300 mt-2">{item.description}</p>
                            <a href="#" className="mt-4 inline-block bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-lg transition">View Details</a>
                        </div>
                    )  
                })

                }

            </div>

        </section>
    )
}

export default HackathonList