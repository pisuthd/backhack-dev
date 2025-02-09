
import BaseModal from "./base"
import { useCallback, useContext, useReducer } from "react"
import { Puff } from 'react-loading-icons'
import { DatabaseContext } from "@/contexts/database";
import useAtoma from "@/hooks/useAtoma";

const FetchTeamsModal = ({ visible, close, hackathon }: any) => {

    const { fetchTeams }: any = useAtoma()

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

            const { hackathonId, teamId, team, description } = await fetchTeams({
                context,
                hackathon
            })

            await addTeam({
                hackathonId,
                teamId,
                name: team,
                description
            })

            close()

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
                        <p className="text-gray mt-2 px-0.5 text-base">Automatically import teams and their details by the DeepSeek's AI-agent from the official hackathon website belows:</p>
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