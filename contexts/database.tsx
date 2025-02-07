import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react"
import { AccountContext } from "./account"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource"

export const DatabaseContext = createContext({})

const client = generateClient<Schema>();

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

        console.log("hackathonId --> ", hackathonId)


        const team = await client.models.Team.create({
            hackathonId,
            name,
            description,
            onchainId: teamId
        })

        console.log(team)

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

    const databaseContext = useMemo(
        () => ({
            userData,
            hackathons,
            addTeam
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