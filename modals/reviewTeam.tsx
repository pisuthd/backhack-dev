
import BaseModal from "./base"
import { useCallback, useContext, useReducer, useState } from "react"
import { Puff } from 'react-loading-icons'
import axios from "axios";
import { DatabaseContext } from "@/contexts/database";

const ReviewTeamModal = ({ visible, close, hackathon, teams, prizes }: any) => {

    const { addReview }: any = useContext(DatabaseContext)

    const [values, setState] = useReducer((prev: any, next: any) => ({ ...prev, ...next }), {
        errorMessage: undefined,
        loading: false,
        selected: undefined

    })

    const { errorMessage, loading, selected } = values

    const onReview = useCallback(async () => {

        if (!selected) {
            setState({ errorMessage: `Not selected` })
            return
        }

        const currentTeam = teams.find((item: any) => item.name === selected)

        if (!currentTeam) {
            setState({ errorMessage: `Invalid team selected` })
            return
        }

        const reviews = await currentTeam.comments()

        if (reviews.data.length > 0) {
            setState({ errorMessage: `Already reviewed` })
            return
        }

        setState({ errorMessage: undefined, loading: true })

        try {

            const systemPrompt = [
                "You are an AI assistant for reviewing teams participating in the hackathon ",
                "with the following details:\n\n",
                `Hackathon Name : ${hackathon.title}\n`,
                `Hackathon Prizes:\n`,
            ].concat(prizes.map((item: any) => `- ${item.title}\n`)).join("")

            const initPrompt = [
                "Given the following teams:\n\n"
            ]
                .concat(teams.map((item: any, index: number) => `${index + 1}. **${item.name}** - ${item.description}\n`))
                .concat([
                    `\n\nPlease help review Team ${selected} based on the following factors:\n`,
                    "Innovation: Does the project introduce a novel concept or improve existing ideas?\n",
                    "Impact & Feasibility: Can this project have real-world applications? Is it viable beyond the hackathon?",
                    "Prize Tier Relevance: Does this project align with the criteria of specific prize categories?"
                ])
                .join("")

            let messages = [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: 'user',
                    content: initPrompt
                }
            ]

            let response = await axios.post(
                'https://api.atoma.network/v1/chat/completions',
                {
                    stream: false,
                    model: 'deepseek-ai/DeepSeek-R1',
                    messages,
                    max_tokens: 1024
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.ATOMA_API_KEY}`
                    }
                }
            );

            console.log(response.data)

            let reviewMessage = response.data.choices[0].message.content
            reviewMessage = reviewMessage.split("</think>")[1]

            console.log("reviewMessage:", reviewMessage)

            messages.push({
                role: "assistant",
                content: reviewMessage
            })

            messages.push({
                role: 'user',
                content: `Now assign a rating (0-100%) on Team ${selected}`
            })

            response = await axios.post(
                'https://api.atoma.network/v1/chat/completions',
                {
                    stream: false,
                    model: 'deepseek-ai/DeepSeek-R1',
                    messages,
                    max_tokens: 1024
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.ATOMA_API_KEY}`
                    }
                }
            )

            let comment = response.data.choices[0].message.content

            comment = comment.split("</think>")[1]

            console.log("final comment: ", comment)

            const teamId = currentTeam.id

            if (comment) {
                await addReview({
                    teamId,
                    feedback: comment
                })
            }

            close()

        } catch (e: any) {
            console.log(e)
            setState({ errorMessage: `${e.message}` })
        }

        setState({ loading: false })

    }, [selected, teams, prizes, hackathon])

    return (
        <BaseModal visible={visible} close={close} title="Review Team" maxWidth="max-w-lg">
            {hackathon && (
                <>
                    <div className="py-2 pt-0">
                        <p className="text-gray mt-2 px-0.5 text-base">Start the team review process with the DeepSeek's AI-agent by comparing with other teams and prize tiers available:</p>
                        <select value={selected} onChange={(e: any) => {
                            setState({ selected: e.target.value })
                        }} className="block w-full mt-2 p-2 cursor-pointer  rounded-lg text-base bg-[#141F32] border border-gray/30 placeholder-gray text-white focus:outline-none">
                            <option value={undefined}>Select a team</option>
                            {teams.map((t: any, index: number) => (
                                <option key={index} value={t.name}>{t.name}</option>
                            ))}
                        </select>


                        <div className="mt-4 flex   flex-row">
                            <button disabled={loading} onClick={onReview} type="button" className="btn ml-auto mr-1 rounded-lg  py-2.5 px-8  cursor-pointer   bg-purple-600 hover:bg-purple-500 text-white flex flex-row">
                                {(loading)
                                    ?
                                    <Puff
                                        stroke="#000"
                                        className="w-5 h-5 mx-auto"
                                    />
                                    :
                                    <>
                                        Review
                                    </>}
                            </button>
                            <button onClick={() => {
                                close()
                            }} type="button" className="btn mr-auto ml-1 rounded-lg  py-2.5 px-8  cursor-pointer   bg-purple-600 hover:bg-purple-500 text-white flex flex-row">
                                Cancel
                            </button>
                        </div>


                        {errorMessage && (
                            <p className="text-sm text-center mt-2 text-purple-400">
                                {errorMessage}
                            </p>
                        )}

                    </div>
                </>
            )}
        </BaseModal>
    )
}

export default ReviewTeamModal
