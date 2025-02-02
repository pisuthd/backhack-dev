

// const HowItWorks = () => {

import { ArrowRight, Flag } from "react-feather";

//     const steps = [
//         {
//             title: "Explore Hackathons",
//             description:
//                 "Browse upcoming ETHGlobal, Solana Hacker House, and other major hackathons. See the prize pools, participating teams, and betting odds.",
//             icon: "🌍",
//         },
//         {
//             title: "Pick a Team & Place Your Bet",
//             description:
//                 "Choose a promising hackathon team, place a bet on their success, and watch the odds update in real-time as more people bet.",
//             icon: "🎯",
//         },
//         {
//             title: "Hackathon Ends – Results Are Verified",
//             description:
//                 "Once the hackathon concludes, we fetch official results. If your team wins, you receive payouts based on the odds automatically.",
//             icon: "🏆",
//         },
//         {
//             title: "Earn Even If You’re Not Betting",
//             description:
//                 "Provide liquidity to the betting pool and earn passive rewards while supporting the best builders.",
//             icon: "💰",
//         },
//     ];

//     return (
//         <section className="py-16 bg-gray-950 text-white">
//             <div className="max-w-4xl mx-auto text-center">
//                 <h2 className="text-4xl font-bold text-purple-400">How It Works 🚀</h2>
//                 <p className="mt-4 text-gray-300">
//                     Bet on the best. Win big when they do. Support real builders.
//                 </p>
//             </div>

//             <div className="mt-12 grid md:grid-cols-2 gap-8 max-w-5xl mx-auto px-6">
//                 {steps.map((step, index) => (
//                     <div
//                         key={index}
//                         className="bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-800 hover:border-purple-500 transition"
//                     >
//                         <div className="text-4xl">{step.icon}</div>
//                         <h3 className="mt-4 text-xl font-semibold text-purple-400">
//                             {step.title}
//                         </h3>
//                         <p className="mt-2 text-gray-400">{step.description}</p>
//                     </div>
//                 ))}
//             </div>

//             <div className="mt-12 text-center">
//                 <a
//                     href="#"
//                     className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition"
//                 >
//                     Start Betting Today!
//                 </a>
//             </div>
//         </section>
//     )
// }


// export default HowItWorks

export default function HowItWorks() {
    const steps = [
        {
            title: "1. Explore Hackathons",
            description: "Browse active hackathons. See the details, participating teams or add new one if it's not there yet.",
            icon: "🌍",
        },
        {
            title: "2. Pick a Team & Place Your Bet",
            description: "Place bets on the team you think will win a prize or enter the final before the hackathon submission deadline.",
            icon: "🎯",
        },
        {
            title: "Earn Rewards",
            description: "After the hackathon ends, the results are verified and winning bets are paid out based on the team’s performance.",
            icon: "💰",
        },
    ];

    return (
        <section className="py-20 bg-gray-950 text-white text-center">
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
                        className="bg-gray-900 flex flex-col cursor-default text-left p-6 px-4 rounded-xl shadow-lg border border-gray-800 hover:border-purple-500 transition"
                    >
                        <div className="flex flex-row">
                            <h3 className="text-3xl font-semibold text-left text-purple-400">
                                STEP {index + 1}
                            </h3>
                            {index !== 2 && <ArrowRight size={36} className="text-purple-400 mt-[2px] ml-auto" />}
                            {index === 2 && <Flag size={34} className="text-purple-400 mt-[2px] ml-auto" />}
                        </div>

                        <p className="mt-2 text-gray-400 mb-2">{step.description}</p>
                        <div className="text-4xl mt-auto">{step.icon}</div>
 
                    </div>
                ))}
            </div>
        </section>
    );
}