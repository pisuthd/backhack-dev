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
            userData: undefined
        }
    )

    const { userData } = values

    useEffect(() => {
        isConnected && loadUser(user)
    }, [isConnected, user])

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
            userData
        }), [
        userData
    ])

    return (
        <DatabaseContext.Provider value={databaseContext}>
            {children}
        </DatabaseContext.Provider>
    )
}

export default Provider