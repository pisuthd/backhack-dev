"use client"

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { useContext, useEffect, useState } from "react"
import { AccountContext } from "@/contexts/account"
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { FaRegCopy } from "react-icons/fa6";
import { shortText } from '@/helpers'

const Account = () => {

    const { user, logout, address, isConnected, getBalance }: any = useContext(AccountContext)

    const [balance, setBalance] = useState(0)

    useEffect(() => {
        isConnected && getBalance().then(setBalance)
    }, [isConnected])

    return (
        <div className="flex h-screen w-full justify-center pt-24 px-4 text-gray-300">
            <div className="w-full max-w-md">
                <TabGroup>
                    <TabList className="flex gap-4"> 
                        {["Overview", "Positions"].map((name) => (
                            <Tab
                                key={name}
                                className="rounded-full cursor-pointer py-2 px-6 text-base  text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
                            >
                                {name}
                            </Tab>
                        ))}
                    </TabList>
                    <TabPanels className="mt-3">

                        <TabPanel className="rounded-xl bg-white/5 p-3 ">
                            <div className="border rounded-xl border-neutral-600 p-6 px-4 grid grid-cols-2 gap-3 ">
                                <div className="col-span-2">
                                    <h2 className="font-semibold text-2xl text-white ">Overview</h2>
                                </div>
                                <div>
                                    <p className="mt-4 mb-0 text-gray-400">Email:</p>
                                    <p>
                                        {user && user.email}
                                    </p>
                                </div>
                                <div>
                                    <p className="mt-4 mb-0 text-gray-400">Network:</p>
                                    <p>
                                        SUI Testnet
                                    </p>
                                </div>
                                <div>
                                    <p className="mt-4 mb-0 text-gray-400">Wallet Address:</p>
                                    <CopyToClipboard
                                        text={address}
                                    >
                                        <span className="cursor-pointer hover:opacity-60 flex flex-row ">
                                            <FaRegCopy className="mr-1 my-auto" />
                                            {shortText(address, 8, -6)}

                                        </span>
                                    </CopyToClipboard>
                                </div>
                                <div>
                                    <p className="mt-4 mb-0 text-gray-400">Balance:</p>
                                    <p>
                                        {(balance).toLocaleString()} SUI
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-left mt-2">
                                        More Testnet SUI can be request from the <a href="https://docs.sui.io/guides/developer/getting-started/get-coins" className='underline' target="_blank">faucet</a>
                                    </p>
                                </div> 
                            </div>
                        </TabPanel>
                        <TabPanel className="rounded-xl bg-white/5 p-3">
                            B
                        </TabPanel>

                        {/* {categories.map(({ name, posts }) => (
                            <TabPanel key={name} className="rounded-xl bg-white/5 p-3">
                                <ul>
                                    {posts.map((post) => (
                                        <li key={post.id} className="relative rounded-md p-3 text-sm/6 transition hover:bg-white/5">
                                            <a href="#" className="font-semibold text-white">
                                                <span className="absolute inset-0" />
                                                {post.title}
                                            </a>
                                            <ul className="flex gap-2 text-white/50" aria-hidden="true">
                                                <li>{post.date}</li>
                                                <li aria-hidden="true">&middot;</li>
                                                <li>{post.commentCount} comments</li>
                                                <li aria-hidden="true">&middot;</li>
                                                <li>{post.shareCount} shares</li>
                                            </ul>
                                        </li>
                                    ))}
                                </ul>
                            </TabPanel>
                        ))} */}
                    </TabPanels>
                </TabGroup>

                <div>
                    <button onClick={() => logout()} className="mt-4 flex flex-row cursor-pointer  bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-6 rounded-lg transition">
                        Logout
                    </button>
                </div>

            </div>
        </div>
    )
}

export default Account