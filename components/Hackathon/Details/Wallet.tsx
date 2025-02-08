import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { useContext, useEffect, useState } from "react"
import { AccountContext } from "@/contexts/account"
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { FaRegCopy } from "react-icons/fa6";
import { shortText } from '@/helpers'
import { DatabaseContext } from '@/contexts/database';
import { Result } from 'aws-cdk-lib/aws-stepfunctions';

const WalletPanel = ({ positions, teams }: any) => {

    const { isConnected, user }: any = useContext(AccountContext)
    const { userData }: any = useContext(DatabaseContext)

    const myPositions = userData ? positions.filter((item: any) => item.userId === userData.id) : []

    return (
        <div className='py-6 pr-6 flex-grow'>
            <TabGroup className=" h-full">
                <TabList className="flex gap-4">
                    {["My Wallet", "My Positions", "Claim Prizes"].map((name) => (
                        <Tab
                            key={name}
                            className="rounded-full cursor-pointer py-2 px-6 text-base  text-white focus:outline-none data-[selected]:bg-gray-900 data-[hover]:bg-gray-900 data-[selected]:data-[hover]:bg-gray-900 data-[focus]:outline-1 data-[focus]:outline-white"
                        >
                            {name}
                        </Tab>
                    ))}
                </TabList>
                <TabPanels className="mt-3 h-full  ">
                    <TabPanel className="rounded-xl h-full bg-gray-900 p-3 ">
                        {!isConnected && (<Unauthorised />)}
                        {isConnected && (<Overview positions={myPositions} />)}
                    </TabPanel>
                    <TabPanel className="rounded-xl h-full bg-gray-900 p-3">
                        {!isConnected && (<Unauthorised />)}
                        {isConnected && (<MyPositions positions={myPositions} teams={teams} />)}
                    </TabPanel>
                    <TabPanel className="rounded-xl h-full bg-gray-900 p-3">
                        {!isConnected && (<Unauthorised />)}
                        {isConnected && (<div className="h-full w-full flex">
                            <h2 className='m-auto text-xl font-bold'> Coming Soon</h2>
                           
                        </div>)}
                    </TabPanel>

                </TabPanels>
            </TabGroup>
        </div>
    )
}

const Overview = ({ positions }: any) => {

    const { user, logout, address, isConnected, getBalance }: any = useContext(AccountContext)

    const [balance, setBalance] = useState(0)

    useEffect(() => {
        isConnected && getBalance().then(setBalance)
    }, [isConnected])

    const recent = positions.reduce((result: any, item: any) => {
        if ((new Date(item.createdAt)).valueOf() > result) {
            result = (new Date(item.createdAt)).valueOf()
        }
        return result
    }, 0)

    const totalBets = positions.reduce((result: any, item: any) => {
        result = result + Number(item.betAmount)
        return result
    }, 0)

    return (
        <div className="p-4 px-2  grid grid-cols-4 gap-5">
            <div className='col-span-2'>
                <p className="  text-gray-400">Wallet Address:</p>
                {address && (
                    <CopyToClipboard
                        text={address}
                    >
                        <span className="cursor-pointer hover:opacity-60 flex flex-row ">
                            <FaRegCopy className="mr-1 my-auto" />
                            {shortText(address, 10, -8)}
                        </span>
                    </CopyToClipboard>
                )}
            </div>
            <div>
                <p className="  text-gray-400">Network:</p>
                <p>
                    SUI Testnet
                </p>
            </div>
            <div>
                <p className="  text-gray-400">Balance:</p>
                {balance && (
                    <p>
                        {(balance).toLocaleString()} SUI
                    </p>
                )}
            </div>

            <div className='col-span-2'>
                <p className="  text-gray-400">Recent Activity:</p>
                <p>
                    {recent === 0 ? "No recent activity" : (new Date(recent)).toLocaleString()}
                </p>
            </div>
            <div>
                <p className="  text-gray-400">Total Positions:</p>
                <p>
                    {positions.length}
                </p>
            </div>
            <div>
                <p className="  text-gray-400">Total Bets:</p>
                <p>
                    {totalBets.toLocaleString()}{` SUI`}
                </p>
            </div>

        </div>
    )
}

const MyPositions = ({ positions, teams }: any) => {
    return (
        <div className=" px-2 overflow-y-auto">
            <table className="w-full">
                <thead>
                    <tr className="text-left  ">
                        <th className="py-2 px-4">Predicted Team</th>
                        <th className="py-2 px-4">Bet Amount</th>
                        <th className="py-2 px-4">Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {positions.map((position: any, index: number) => { 
                        const team = teams.find((item: any) => item.onchainId === position.predictedTeam) 
                        return (
                            <tr className="border-b" key={index}>
                                <td className="py-2 px-4">
                                    {team && team.name}
                                </td>
                                <td className="py-2 px-4">{position.betAmount} SUI</td>
                                <td className="py-2 px-4">
                                    {(new Date(position.createdAt)).toLocaleString()}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

const Unauthorised = () => {
    return (
        <div className="border rounded-xl border-neutral-600 flex flex-col items-center justify-center h-full">
            <h1 className="text-lg   text-white">
                Please log in to access this panel
            </h1>
        </div>
    )
}

export default WalletPanel