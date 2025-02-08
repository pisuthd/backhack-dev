import { DatabaseContext } from "@/contexts/database"
import BaseModal from "./base"
import { useCallback, useContext, useReducer, useEffect } from "react"
import { AccountContext } from "@/contexts/account"
import { MarketContext } from "@/contexts/market"
import { Puff } from 'react-loading-icons'

const BetModal = ({ visible, close, currentTeam, currentHackathon }: any) => {

    const { placeBet }: any = useContext(MarketContext)
    const { isConnected, getBalance }: any = useContext(AccountContext)


    const [state, setState] = useReducer((prev: any, next: any) => ({ ...prev, ...next }), {
        amount: 0.1,
        balance: 0,
        errorMessage: undefined,
        loading: false
    })

    const { amount, balance, errorMessage, loading } = state

    useEffect(() => {
        isConnected && getBalance().then(
            (balance: any) => {
                setState({ balance })
            }
        )
    }, [isConnected])


    const handleBet = useCallback(async () => {

        setState({ errorMessage: undefined })

        if (!amount || amount && amount < 0.1) {
            setState({ errorMessage: "Minimum amount is 0.1" })
            return
        }

        setState({ loading: true })

        try {

            const teamId = currentTeam.onchainId
            const hackathonId = currentHackathon.onchainId

            await placeBet({ betAmount: amount, teamId, hackathonId, hackathonUuid: currentHackathon.id })

            setState({ amount: 0.1, loading: false })

            close()

        } catch (e: any) {
            console.log(e)
            setState({ errorMessage: `${e.message}`, loading: false })
        }


        setState({ loading: false })


    }, [amount, currentTeam, currentHackathon, placeBet])

    return (
        <BaseModal visible={visible} close={close} title={"Place Your Bet"} maxWidth="max-w-sm">
            {currentTeam && (
                <div className="flex flex-col gap-4">

                    <div className="  ">
                        <h2 className="mb-2">Amount:</h2>
                        <div className="flex flex-row">
                            <input type="number" step={0.1} value={amount} onChange={(e) => setState({ amount: Number(e.target.value) })} id="amount" className={`block w-full p-2  rounded-lg text-base bg-[#141F32] border border-neutral-600 placeholder-gray text-white focus:outline-none`} />
                            <div className="my-auto   mx-4">
                                SUI
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div className="text-sm mt-2 text-gray-400">
                                Balance: {(balance).toLocaleString()} SUI
                            </div>

                        </div>

                        <div className="pt-2">
                            <button
                                disabled={loading}
                                className="bg-purple-600 w-full cursor-pointer text-white px-4 my-auto py-2 rounded-lg hover:bg-purple-500"
                                onClick={handleBet}
                            >
                                {loading
                                    ?
                                    <Puff
                                        stroke="#000"
                                        className="w-5 h-5 mx-auto"
                                    />
                                    :
                                    <>
                                        Confirm
                                    </>}
                            </button>
                        </div>

                        {!errorMessage && (
                            <p className="text-sm text-center mt-2 text-gray-400">
                                Maximum allowed: 1 SUI
                            </p>
                        )}

                        {errorMessage && (
                            <p className="text-sm text-center mt-2 text-purple-400">
                                {errorMessage}
                            </p>
                        )}


                    </div>

                    {/* <div className="grid grid-cols-5 gap-3">



                        <div className="col-span-3 flex flex-col py-4  ">
                            <h2 className=" ">Description:</h2>
                            <p className="text-gray-400  ">
                                {currentTeam.description}
                            </p>
                        </div> 

                        <div className="col-span-2 pl-4 py-4 ">

                            <div className="px-2  ">
                                <h2 className="mb-2">Amount:</h2>
                                <div className="flex flex-row"> 
                                    <input type="number" step={0.1} value={amount} onChange={(e) => setState({ amount: Number(e.target.value) })} id="amount" className={`block w-full p-2  rounded-lg text-base bg-[#141F32] border border-neutral-600 placeholder-gray text-white focus:outline-none`} />
                                    <div className="my-auto   mx-4">
                                        SUI
                                    </div>
                                </div>
                                <div className="text-sm mt-2 text-gray-400">
                                    Balance: {(balance).toLocaleString()} SUI
                                </div>

                            </div>


                            <div className="flex flex-col gap-2">
                                <label htmlFor="amount">Amount</label>
                                <input type="number" name="amount" id="amount" className="border border-gray-300 rounded-md p-2" onChange={(e) => setState({ amount: Number(e.target.value) })} />
                            </div>
                            <button className="bg-blue-500 text-white rounded-md p-2"
                            // onClick={handleBet}
                            >Bet</button> 

                        </div>


                    </div>*/}



                </div>
            )

            }
        </BaseModal>
    )
}

export default BetModal