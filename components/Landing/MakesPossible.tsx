

const MakesPossible = () => {
    return (
        <section className="bg-gray-950 text-white py-12">
            <div className="text-center mb-8">
                <h2 className="text-4xl font-extrabold text-purple-400">Makes Possible By</h2>
                <p className="mt-4 text-lg text-gray-300">Built with cutting-edge tools and partnerships to bring trust and transparency to hackathon betting.</p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-8 px-6">
                <div className="flex justify-center items-center hover:text-cyan-400">
                    <img src="/images/ethereum-logo.png" alt="Ethereum" className="w-16 h-16" />
                </div>

                <div className="flex justify-center items-center hover:text-cyan-400">
                    <img src="/images/ai-logo.png" alt="AI Tool" className="w-16 h-16" />
                </div>

                <div className="flex justify-center items-center hover:text-cyan-400">
                    <img src="/images/solana-logo.png" alt="Solana" className="w-16 h-16" />
                </div>
            </div>

            <div className="mt-8 text-center">
                <a href="#" className="text-purple-400 font-bold">Learn more about our partners</a>
            </div>
        </section>

    )
}


export default MakesPossible