


const Hero = () => (
    <>
        <section className="bg-gray-950 text-white pt-[150px] sm:pt-[200px] pb-[100px] text-center">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <h1 className="text-3xl sm:text-5xl font-bold text-purple-400 leading-tight">
                    Turn Your Hackathon Hype <br /> into Real Rewards
                </h1>
                <p className="mt-4 text-base sm:text-lg text-gray-300">
                    BackHack.dev’s AI Agent tracks major hackathons, allowing you and your supporters to bet on the results and earn rewards when you succeed.
                </p>
                <div className="mt-8 space-x-4">
                    <a
                        href="#hackathons"
                        className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition"
                    >
                        Explore Hackathons
                    </a>
                    <a
                        href="#how-it-works"
                        className="border border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white font-bold py-3 px-6 rounded-xl transition"
                    >
                        Learn More
                    </a>
                </div>
                {/* <div className="mt-6 sm:mt-8  text-gray-300 text-sm ">
                We're in the early stages of development and currently live on the Sui Testnet
                </div> */}
            </div>
        </section>
        {/* <section className="bg-slate-100 border-b border-gray-300">
                <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
                    <div className="mr-auto place-self-center lg:col-span-7">
                        <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">Turn Your Hackathon Hype into Real Rewards</h1>
                        <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">From checkout to global sales tax compliance, companies around the world use Flowbite to simplify their payment stack.</p>
                        <a href="#" className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">
                            Get started
                            <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                        </a>
                        <a href="#" className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                            Speak to Sales
                        </a>
                    </div>
                    <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
                        <img src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/hero/phone-mockup.png" alt="mockup"/>
                    </div>
                </div>
            </section> */}
    </>
)

export default Hero