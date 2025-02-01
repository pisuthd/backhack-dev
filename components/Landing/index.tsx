


const Landing = () => {
    return (
        <>
            {/* <section className="relative bg-slate-200 text-white py-[160px] flex flex-col items-center justify-center px-6 text-center">
                
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700/30 to-cyan-400/20 blur-3xl opacity-30"></div>

                
                <h1 className="text-5xl font-extrabold text-gray-600 ">
                    Stake Your Skills. Support Your Favorites.
                </h1>
                <p className="mt-4 text-lg text-gray-300 max-w-2xl">
                    Bet on hackathon teams, win big when they do. Power the next generation of builders.
                </p>

               
                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                    <a href="#" className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition">
                        Start Betting
                    </a>
                    <a href="#" className="border border-gray-700 hover:border-cyan-400 text-gray-300 hover:text-cyan-400 font-bold py-3 px-6 rounded-xl transition">
                        Explore Hackathons
                    </a>
                </div>
 
                <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-gray-950 to-transparent"></div>
            </section> */}
            <section className="bg-slate-100 border-b border-gray-300">
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
            </section>
        </>
    )
}

export default Landing