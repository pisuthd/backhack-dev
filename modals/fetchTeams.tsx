
import BaseModal from "./base"
import { useCallback, useContext, useReducer } from "react"
import { Puff } from 'react-loading-icons'
import axios from "axios";

// import { generateClient } from "aws-amplify/api";
// import { Schema } from "@/amplify/data/resource";
// import { createAIHooks } from "@aws-amplify/ui-react-ai";
import { DatabaseContext } from "@/contexts/database";

// const client = generateClient<Schema>({ authMode: "apiKey" });
// const { useAIConversation, useAIGeneration } = createAIHooks(client);

const FetchTeamsModal = ({ visible, close, hackathon }: any) => {

    // const [state, fetchTeams] = useAIGeneration("FetchTeamAI")

    // const { data, isLoading, hasError } = state

    const { addTeam, crawl }: any = useContext(DatabaseContext)

    const [values, setState] = useReducer((prev: any, next: any) => ({ ...prev, ...next }), {
        errorMessage: undefined,
        loading: false
    })

    const { errorMessage, loading } = values

    const onStart = useCallback(async () => {

        if (hackathon.urls.length === 0) {
            setState({ errorMessage: `No URL provided` })
            return
        }

        setState({ errorMessage: undefined, loading: true })

        try {

            const url = hackathon.urls[Math.floor(Math.random() * hackathon.urls.length)];
            const context = await crawl(url)

            const initPrompt = [
                "List all teams from the provided markdown content.",
                "Provided content:",
                context
            ].join("")

            let messages = [
                {
                    role: "system",
                    content: `You are an AI assistant that reads official website content to fetch teams. `
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

            let initMessage = response.data.choices[0].message.content
            initMessage = initMessage.split("</think>")[1]

            const regex = /\d+\.\s\*\*(.*?)\*\*/g;
            let teams = [];
            let match;

            while ((match = regex.exec(initMessage)) !== null) {
                teams.push(match[1]);
            }

            if (teams.length === 0) {
                // Regex to match team names after numbered list
                const teamRegex = /^\d+\.\s+(.*)$/gm;

                // Extract team names
                teams = [...initMessage.matchAll(teamRegex)].map(match => match[1]);
            }


            if (teams.length > 0) {
                console.log("Teams: ", teams)

                messages.push({
                    role: "assistant",
                    content: initMessage
                })

                const team = teams[Math.floor(Math.random() * teams.length)];

                console.log("Fetching description from Team: ", team)

                messages.push({
                    role: 'user',
                    content: `Fetch description of team ${team}`
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

                let description = response.data.choices[0].message.content
 
                const lastThinkIndex = description.lastIndexOf("</think>");

                // If a colon is found, split the string at the last colon
                if (lastThinkIndex !== -1) {
                    description = description.slice(lastThinkIndex + 8).trim(); // Content after the last colon
                }

                if (description.indexOf(">") !== -1) {
                    description = description.split(">")[1]
                }

                if (description.indexOf("the provided content:") !== -1) {
                    description = description.split("the provided content:")[1]
                }

                if (description.indexOf("---") !== -1) {
                    description = description.split("---")[1]
                }

                console.log("Description after trimmed: ", description)

                const { data } = await hackathon.teams()

                const maxTeamId = data.reduce((result: number, item: any) => {
                    if (item.onchainId > result) {
                        result = item.onchainId
                    }
                    return result
                }, 0)

                const teamId = maxTeamId + 1
                const hackathonId = hackathon.id

                await addTeam({
                    hackathonId,
                    teamId,
                    name: team,
                    description
                })

                close()
            } else {
                throw new Error("No teams found. The website may be down or there may be another issue.")
            }

        } catch (e: any) {
            console.log(e)
            setState({ errorMessage: `${e.message}` })
        }

        setState({ loading: false })

    }, [hackathon])

    return (
        <BaseModal
            visible={visible}
            close={close}
            title="Fetch Teams from Official Source"
            maxWidth="max-w-xl"
        >

            {hackathon && (
                <>
                    <div className="py-2 pt-0">
                        <p className="text-gray mt-2 px-0.5 text-base">Automatically import teams and their details by the AI-agent from the official hackathon website belows:</p>
                        <div className="mt-4  flex flex-col space-y-2">
                            {hackathon.urls.map((url: string, index: number) => {
                                return (
                                    <input key={index} type="text" value={url} id="title" className={`block w-full p-2  rounded-lg text-base bg-[#141F32] border border-neutral-600 placeholder-gray text-white focus:outline-none`} />
                                )
                            })}
                        </div>
                        <p className="text-purple-400/90 text-sm mt-2 px-0.5 text-center">
                            On this hackathon version. To save on token costs, only one team is imported randomly from the website at a time.
                        </p>
                    </div>
                    <div className="mt-2 flex   flex-row">
                        <button disabled={loading} onClick={onStart} type="button" className="btn ml-auto mr-1 rounded-lg  py-2.5 px-8  cursor-pointer   bg-purple-600 hover:bg-purple-500 text-white flex flex-row">
                            {(loading)
                                ?
                                <Puff
                                    stroke="#000"
                                    className="w-5 h-5 mx-auto"
                                />
                                :
                                <>
                                    Start
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
                </>
            )

            }

        </BaseModal>
    )
}

export default FetchTeamsModal