import { ArrowDown, ArrowUp } from "react-feather";


const MakesPossible = () => {

    const steps = [
        {
            title: "Atoma Network",
            description: "A decentralized, private and verifiable AI execution platform that enables secure AI applications with full privacy",
            icon: "🌍",
            url:"https://atoma.network"
        },
        { 
            title: "DeepSeek R1",
            description: "A world-renowned AI large language model that delivers faster and more efficient responses",
            icon: "🎯",
            url:"https://www.deepseek.com"
        },
        {
            title: "Sui Blockchain",
            description: "A Layer 1 blockchain designed to scale efficiently, enabling Move-based dapps with low latency and high throughput",
            icon: "💰",
            url:"https://sui.io"
        },
        {
            title: "zkLogin",
            description: "Simplifies dApp access by enabling seamless sign-ins using familiar web credentials like Google accounts or email",
            icon: "💰",
            url:"https://sui.io/zklogin"
        },
    ];

    return (
        <section className="bg-gray-950 text-white py-12 mb-6">
            <div className="text-center mb-8">
                <h2 className="text-4xl font-extrabold text-purple-400">Technologies</h2>
                <p className="mt-4 max-w-4xl mx-auto text-lg text-gray-300">BackHack.dev leverages following technologies from decentralized AI networks to advanced authentication protocols to make any hackathon more engaging and fun</p>
            </div>

            <div className="mt-12 grid md:grid-cols-2 gap-3 max-w-screen-lg mx-auto px-6">
                {steps.map((step, index) => (
                    <>
                        <div
                            key={index}
                            className="bg-gray-900 flex flex-col cursor-default text-left p-6 px-4 py-8 rounded-lg shadow-lg border border-gray-800  transition"
                        >


                            <h3 className="text-3xl  font-semibold text-center text-purple-400">
                                {step.title}
                            </h3>


                            <p className="mt-2 text-center text-gray-400 mb-2">{step.description}</p>

                            <a href={step.url} className="hover:underline text-center text-sm text-gray-200" target="_blank" >
                                {step.url}
                            </a>

                        </div>
                        {[0, 2].includes(index) && (
                            <div>
                                {index === 0 && (
                                    <div className="flex h-full">

                                        <div data-aos="fade-down" data-aos-duration="1000" className="m-auto py-4 flex flex-row text-purple-400 ">
                                            <ArrowDown size={32} />
                                            <h2 className="text-2xl sm:text-3xl ml-2 font-semibold text-purple-400 ">The Best of Web3</h2>
                                        </div>

                                    </div>
                                )}
                                {index === 2 && (
                                    <div className="flex h-full">

                                        <div data-aos="fade-up" data-aos-duration="1000" className="m-auto py-4 flex flex-row text-purple-400 ">
                                            <ArrowUp size={32} />
                                            <h2 className="text-2xl sm:text-3xl ml-2 font-semibold text-purple-400 ">The Best of AI</h2>
                                        </div>

                                    </div>
                                )}
                            </div>
                        )}
                    </>
                ))}

            </div>

            {/* <div className="mt-8 text-center">
                <a href="#" className="text-purple-400 font-bold">Learn more about our partners</a>
            </div> */}
        </section>

    )
}


export default MakesPossible