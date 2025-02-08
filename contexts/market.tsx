import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react"
import { useWallet } from "@suiet/wallet-kit"
import { TransactionBlock, Inputs } from '@mysten/sui.js/transactions'
import { SuiClient, getFullnodeUrl, SuiMoveObject } from '@mysten/sui.js/client'
import BigNumber from "bignumber.js"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource"
import MarketData from "../data/market.json"
import { useEnokiFlow, useZkLogin, useZkLoginSession } from "@mysten/enoki/react";
import { useCurrentAccount, useCurrentWallet, useDisconnectWallet, useSignTransaction, useSuiClient } from "@mysten/dapp-kit";
import { Transaction } from '@mysten/sui/transactions';
import { DatabaseContext } from "./database"
import { AccountContext } from "./account"


export const MarketContext = createContext({})

const client = generateClient<Schema>();

interface IPlaceBet {
    betAmount: number,
    hackathonId: number,
    teamId: number,
    hackathonUuid: any
}

const Provider = ({ children }: any) => {
 
    const { addPosition, userData }: any = useContext(DatabaseContext)

    const client = useSuiClient()
    const enokiFlow = useEnokiFlow();

    const [values, dispatch] = useReducer(
        (curVal: any, newVal: any) => ({ ...curVal, ...newVal }),
        {

        }
    )

    const { } = values

    // useEffect(() => {
    //     loadMarketGlobal()
    // }, [])

    const getIds = useCallback(async () => {

        const suiClient = new SuiClient({ url: getFullnodeUrl("testnet") })

        const marketId = MarketData.MarketGlobal

        const { data } = await suiClient.getObject({
            id: marketId,
            options: {
                "showType": false,
                "showOwner": false,
                "showPreviousTransaction": false,
                "showDisplay": false,
                "showContent": true,
                "showBcs": false,
                "showStorageRebate": false
            }
        })

        const content: any = data?.content

        return {
            positions_id: content?.fields?.positions?.fields?.id?.id,
            markets_id: content?.fields?.markets?.fields?.id?.id
        }

    }, [])

    const getHackathon = useCallback(async (marketId: number) => {

        const { markets_id } = await getIds()

        const client = new SuiClient({ url: getFullnodeUrl("testnet") })
        const dynamicFieldPage = await client.getDynamicFields({ parentId: markets_id })

        for (let round of dynamicFieldPage.data) {
            const { objectId } = round
            const result: any = await client.getObject({
                id: objectId,
                options: {
                    "showType": false,
                    "showOwner": false,
                    "showPreviousTransaction": false,
                    "showDisplay": false,
                    "showContent": true,
                    "showBcs": false,
                    "showStorageRebate": false
                }
            })

            if (result.data.content.fields.name === `${marketId}`) {

                return {
                    marketId: result.data.content.fields.name,
                    balance: result.data.content.fields.value.fields.balance,
                    totalBetsId: result.data.content.fields.value.fields.total_bets.fields?.id?.id,
                    totalBetsAmount: result.data.content.fields.value.fields.total_bets_amount
                }
            }

        }

        return undefined

    }, [])

    // const addTeam = useCallback(async ({ hackathonId, teamId, name, description }: any) => {

    //     const team = await client.models.Team.create({
    //         hackathonId,
    //         name,
    //         description,
    //         onchainId: teamId
    //     })

    //     console.log(team)

    //     loadHackathons()

    // }, [])

    const placeBet = useCallback(async ({
        betAmount,
        hackathonId,
        teamId,
        hackathonUuid,
    }: IPlaceBet) => {

        const keypair = await enokiFlow.getKeypair({ network:"testnet"});

        const marketId = MarketData.MarketGlobal
        const packageId = MarketData.PackageID

        const tx = new Transaction();

        const [coin] = tx.splitCoins(tx.gas, [BigNumber(betAmount).multipliedBy(10 ** 9).toString()])

        tx.moveCall({
            target: `${packageId}::market::place_bet`,
            arguments: [
                tx.object(`${marketId}`),
                tx.pure.u64(hackathonId),
                tx.pure.u64(teamId),
                coin
            ]
        })

        // Sign and execute the transaction, using the Enoki keypair
        await client.signAndExecuteTransaction({
            signer: keypair,
            transaction: tx,
        });

        await addPosition({
            betAmount: `${betAmount}`,
            hackathonId: hackathonUuid,
            userId: userData.id,
            teamId
        })

    }, [userData])

    const marketContext = useMemo(
        () => ({
            getHackathon,
            placeBet
        }), [
        placeBet
    ])

    return (
        <MarketContext.Provider value={marketContext}>
            {children}
        </MarketContext.Provider>
    )
}

export default Provider