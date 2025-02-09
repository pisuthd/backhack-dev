import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react"
import { AccountContext } from "./account"
import FirecrawlApp from '@mendable/firecrawl-js';
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource"

export const DatabaseContext = createContext({})

const client = generateClient<Schema>();

const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY || ""

const app = new FirecrawlApp({ apiKey: FIRECRAWL_API_KEY });

const Provider = ({ children }: any) => {

    const { isConnected, user }: any = useContext(AccountContext)

    const [values, dispatch] = useReducer(
        (curVal: any, newVal: any) => ({ ...curVal, ...newVal }),
        {
            userData: undefined,
            hackathons: []
        }
    )

    const { userData, hackathons } = values

    useEffect(() => {
        isConnected && loadUser(user)
    }, [isConnected, user])

    useEffect(() => {
        loadHackathons()
    }, [])

    const loadHackathons = useCallback(async () => {
        const hackathons = await client.models.Hackathon.list()
        dispatch({ hackathons: hackathons.data })
    }, [])

    const addTeam = useCallback(async ({ hackathonId, teamId, name, description }: any) => {

        await client.models.Team.create({
            hackathonId,
            name,
            description,
            onchainId: teamId
        })

        loadHackathons()

    }, [])

    const addReview = useCallback(async ({ teamId, feedback }: any) => {

        await client.models.Review.create({
            teamId,
            reviewer: "DeepSeek R1", 
            feedback
        })

        loadHackathons()

    }, [])

    const addPosition = useCallback(async ({ hackathonId, userId, teamId, betAmount }: any) => {

        const { data } = await client.models.Position.list()

        const maxTeamId = data.reduce((result: number, item: any) => {
            if (item.onchainId > result) {
                result = item.onchainId
            }
            return result
        }, 0)

        const onchainId = maxTeamId + 1

        await client.models.Position.create({
            userId,
            hackathonId,
            onchainId,
            predictedTeam: teamId,
            betAmount
        })

        loadHackathons()

    }, [])

    const loadUser = useCallback(async (user: any) => {

        if (user && user.email) {

            const { email } = user

            const entry = await client.models.User.list({
                filter: {
                    username: {
                        eq: email
                    }
                }
            })

            if (entry.data.length === 0) {
                const newUser: any = {
                    username: email,
                    hackathons: [],
                    comments: [],
                    positions: [],
                    role: "USER"
                }
                await client.models.User.create({
                    ...newUser
                })
                dispatch({ userData: newUser })
            } else {
                dispatch({ userData: entry.data[0] })
            }
        }

    }, [])

    const getPositions = useCallback(async (hackathonId: string) => {

        const { data } = await client.models.Position.list({
            filter: {
                hackathonId: {
                    eq: hackathonId
                }
            }
        })

        return data

    }, [])
    

    const crawl = async (url: any) => {
        const result: any = (await app.scrapeUrl(url, { formats: ['markdown', 'html'] }))
        return result.markdown
    }

    const databaseContext = useMemo(
        () => ({
            userData,
            hackathons,
            crawl,
            addTeam,
            addPosition,
            getPositions,
            addReview
        }), [
        userData,
        hackathons
    ])

    return (
        <DatabaseContext.Provider value={databaseContext}>
            {children}
        </DatabaseContext.Provider>
    )
}

export default Provider