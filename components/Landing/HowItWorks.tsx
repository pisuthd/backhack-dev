

import { ArrowRight, Flag, MousePointer, Target } from "react-feather";
 
export default function HowItWorks() {
    const steps = [
        {
            title: "1. Explore Hackathons",
            description: "Browse active hackathons. See the participating teams and add new one if it's not there yet.",
            icon: "🌍",
        },
        {
            title: "2. Pick a Team & Place Your Bet",
            description: "Place bets on the team you think will win a prize before the results are concluded.",
            icon: "🎯",
        },
        {
            title: "Earn Rewards",
            description: "AI-agents classify teams into their corresponding prize tiers. Winners can then claim their prizes.",
            icon: "💰",
        },
    ];

    return (
        <section className="py-20 pt-10 bg-gray-950 text-white text-center">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl font-bold text-purple-400">How It Works</h2>
                <p className="mt-4 text-lg text-gray-300">
                    Simple steps to add more fun while participating in hackathons.
                </p>
            </div>

            <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-screen-xl mx-auto px-6">
                {steps.map((step, index) => (
                    <div
                        key={index}
                        className="bg-gray-900 flex flex-col cursor-default text-left p-6 px-4 py-8 rounded-xl shadow-lg border border-gray-800 hover:border-purple-500 transition"
                    >
                        <div className="flex flex-row">
                            
                            <h3 className="text-3xl font-semibold text-left text-purple-400">
                                STEP {index + 1}
                            </h3>
                            {index === 0 && <MousePointer size={34} className="text-purple-400 mt-[2px] ml-auto" />}
                            {index === 1 && <Target size={36} className="text-purple-400 mt-[2px] ml-auto" />}
                            {index === 2 && <Flag size={34} className="text-purple-400 mt-[2px] ml-auto" />}
                        </div>

                        <p className="mt-2 text-gray-400 mb-2">{step.description}</p>
                        {/* <div className="text-4xl mt-auto">{step.icon}</div> */}
 
                    </div>
                ))}
            </div>
        </section>
    );
}