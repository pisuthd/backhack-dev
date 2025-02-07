import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { useContext, useEffect, useState } from "react"
import { AccountContext } from "@/contexts/account"
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { FaRegCopy } from "react-icons/fa6";
import { shortText } from '@/helpers'

const WalletPanel = () => {

    const { isConnected }: any = useContext(AccountContext)

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
                        {isConnected && (<Overview />)}
                    </TabPanel>
                    <TabPanel className="rounded-xl h-full bg-gray-900 p-3">
                        {!isConnected && (<Unauthorised />)}
                    </TabPanel>
                    <TabPanel className="rounded-xl h-full bg-gray-900 p-3">
                        {!isConnected && (<Unauthorised />)}
                    </TabPanel>

                </TabPanels>
            </TabGroup>
        </div>
    )
}

const Overview = () => {

    const { user, logout, address, isConnected, getBalance }: any = useContext(AccountContext)

    const [balance, setBalance] = useState(0)

    useEffect(() => {
        isConnected && getBalance().then(setBalance)
    }, [isConnected])

    return (
        <div className="   p-4 px-2  h-full grid grid-cols-4 gap-3">
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