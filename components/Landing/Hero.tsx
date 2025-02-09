import Link from "next/link"



const Hero = () => (
    <>
        <section className="bg-gray-950 text-white pt-[150px] sm:pt-[200px] pb-[100px] text-center">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <h1  data-aos="fade-up" data-aos-duration="1000"  className="text-3xl sm:text-5xl font-bold text-purple-400 leading-tight">
                    Turn Your Hackathon Hype <br /> into Real Rewards
                </h1>
                <p className="mt-4 text-base sm:text-lg text-gray-300">
                    BackHack.dev’s AI Agent tracks major hackathons, allowing you and your supporters to bet on the results and earn rewards when you succeed
                </p>
                <div className="mt-8 space-x-4">
                    <Link
                        href="/hackathons"
                        className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition"
                    >
                        Explore Hackathons
                    </Link>
                    <a
                        href="#how-it-works"
                        className="border border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white font-bold py-3 px-6 rounded-xl transition"
                    >
                        Learn More
                    </a>
                </div>
                <div className="mt-4 sm:mt-6  text-sm font-semibold text-purple-400 ">
                    Now live on Sui Testnet
                </div>
            </div>
        </section>
    </>
)

export default Hero